using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using BackEnd.Services;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILoginService _loginService;
        private readonly IEmailService _emailService;

        public AuthController(ApplicationDbContext context, ILoginService loginService, IEmailService emailService)
        {
            _context = context;
            _loginService = loginService;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmpEmail == request.Email);

            if (employee == null)
            {
                // Log failed login attempt
                await _loginService.LogLoginAttemptAsync(request.Email, null, false, "Invalid credentials", ipAddress);
                return Unauthorized("Invalid credentials");
            }

            if (!_loginService.VerifyPassword(request.Password, employee.Password_Hash))
            {
                // Log failed login attempt
                await _loginService.LogLoginAttemptAsync(request.Email, null, false, "Invalid credentials", ipAddress);
                return Unauthorized("Invalid credentials");
            }

            var token = _loginService.CreateJwtToken(employee);

            // Log successful login
            await _loginService.LogLoginAttemptAsync(request.Email, employee.EmpId, true, "Login successful", ipAddress);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Role = employee.Role,
                EmployeeId = employee.EmpId
            });
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            
            try
            {
                var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                var employeeIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                // Try to parse employee ID
                if (int.TryParse(employeeIdClaim, out int employeeId) && !string.IsNullOrEmpty(emailClaim))
                {
                    await _loginService.LogLogoutAsync(emailClaim, employeeId, ipAddress);
                }
                else if (!string.IsNullOrEmpty(emailClaim))
                {
                    // Fallback: Try to get employee from database using email
                    var employee = await _context.Employees
                        .FirstOrDefaultAsync(e => e.EmpEmail == emailClaim);
                    
                    if (employee != null)
                    {
                        await _loginService.LogLogoutAsync(emailClaim, employee.EmpId, ipAddress);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the logout request
                Console.WriteLine($"Error logging logout: {ex.Message}");
            }
            
            return Ok("Logout successful");
        }

        // =============================
        // TEST EMAIL ENDPOINT (For testing only)
        // =============================
        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email = "sanilprajwal2@gmail.com")
        {
            try
            {
                var testOtp = "123456";
                var testName = "Test User";
                
                var emailSent = await _emailService.SendOtpEmailAsync(email, testOtp, testName);
                
                if (emailSent)
                {
                    return Ok(new { success = true, message = $"Test email sent successfully to {email}", timestamp = DateTime.UtcNow });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = "Failed to send test email" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // =============================
        // TEST EMPLOYEE ENDPOINT (For testing forgot password only)
        // =============================
        [HttpPost("test-create-employee")]
        public async Task<IActionResult> TestCreateEmployee(CreateEmployeeDto request)
        {
            try
            {
                // Check if employee already exists
                var existingEmployee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmpEmail == request.EmpEmail);

                if (existingEmployee != null)
                {
                    return BadRequest("Employee with this email already exists");
                }

                var employee = new Employee
                {
                    EmpName = request.EmpName ?? "Test Employee",
                    EmpEmail = request.EmpEmail,
                    EmpDOJ = DateTime.UtcNow,
                    Role = request.Role ?? "Employee",
                    Password_Hash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? "Test@12345")
                };

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    actionName: "GetEmployeeById",
                    controllerName: "Employee",
                    routeValues: new { id = employee.EmpId },
                    value: new { empId = employee.EmpId, empEmail = employee.EmpEmail, message = "Test employee created successfully" }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // =============================
        // FORGOT PASSWORD ENDPOINTS
        // =============================

        [HttpPost("forgot-password/send-otp")]
        public async Task<IActionResult> SendOtp(SendOtpRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Email is required");

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmpEmail == request.Email);

            if (employee == null)
                return NotFound("Email not found in system");

            // Generate 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Remove any existing OTP for this email
            var existingOtps = await _context.Otps
                .Where(o => o.Email == request.Email && !o.IsVerified)
                .ToListAsync();

            foreach (var existingOtp in existingOtps)
            {
                _context.Otps.Remove(existingOtp);
            }

            // Create new OTP record
            var otpRecord = new BackEnd.Models.Otp
            {
                Email = request.Email,
                OtpCode = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsVerified = false
            };

            await _context.Otps.AddAsync(otpRecord);
            await _context.SaveChangesAsync();

            // Send email
            var emailSent = await _emailService.SendOtpEmailAsync(request.Email, otp, employee.EmpName ?? "User");

            if (!emailSent)
                return StatusCode(500, "Failed to send OTP email. Please try again.");

            return Ok(new SendOtpResponseDto
            {
                Success = true,
                Message = "OTP sent to your email. Valid for 10 minutes."
            });
        }

        [HttpPost("forgot-password/verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OtpCode))
                return BadRequest("Email and OTP are required");

            var otpRecord = await _context.Otps
                .FirstOrDefaultAsync(o => 
                    o.Email == request.Email && 
                    o.OtpCode == request.OtpCode && 
                    !o.IsVerified);

            if (otpRecord == null)
                return BadRequest("Invalid OTP");

            if (otpRecord.ExpiresAt < DateTime.UtcNow)
            {
                _context.Otps.Remove(otpRecord);
                await _context.SaveChangesAsync();
                return BadRequest("OTP has expired. Request a new one.");
            }

            // Mark OTP as verified
            otpRecord.IsVerified = true;
            otpRecord.VerificationToken = Guid.NewGuid().ToString();

            _context.Otps.Update(otpRecord);
            await _context.SaveChangesAsync();

            return Ok(new VerifyOtpResponseDto
            {
                Success = true,
                Message = "OTP verified successfully",
                VerificationToken = otpRecord.VerificationToken
            });
        }

        [HttpPost("forgot-password/reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.NewPassword) || 
                string.IsNullOrWhiteSpace(request.VerificationToken))
                return BadRequest("Email, password, and verification token are required");

            if (request.NewPassword != request.ConfirmPassword)
                return BadRequest("Passwords do not match");

            if (request.NewPassword.Length < 8)
                return BadRequest("Password must be at least 8 characters long");

            // Verify the verification token
            var otpRecord = await _context.Otps
                .FirstOrDefaultAsync(o => 
                    o.Email == request.Email && 
                    o.VerificationToken == request.VerificationToken && 
                    o.IsVerified);

            if (otpRecord == null)
                return Unauthorized("Invalid verification token");

            // Find employee
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmpEmail == request.Email);

            if (employee == null)
                return NotFound("Employee not found");

            // Update password
            employee.Password_Hash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.Employees.Update(employee);

            // Delete used OTP
            _context.Otps.Remove(otpRecord);

            await _context.SaveChangesAsync();

            // Send confirmation email
            await _emailService.SendPasswordResetConfirmationAsync(request.Email, employee.EmpName ?? "User");

            return Ok(new ResetPasswordResponseDto
            {
                Success = true,
                Message = "Password reset successfully. You can now log in with your new password."
            });
        }
    }
}
