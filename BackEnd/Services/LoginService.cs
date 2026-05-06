using BackEnd.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.IO;

namespace BackEnd.Services
{
    public class LoginService : ILoginService
    {
        private readonly IConfiguration _config;
        private readonly string _logFilePath = "login-log.log";

        public LoginService(IConfiguration config)
        {
            _config = config;
        }

        public bool VerifyPassword(string plainText, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainText, hashedPassword);
        }

        public string CreateJwtToken(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException(nameof(employee));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, employee.EmpId.ToString()),
                new Claim(ClaimTypes.Email, employee.EmpEmail ?? string.Empty),
                new Claim(ClaimTypes.Role, employee.Role ?? string.Empty),
                new Claim(ClaimTypes.Name, employee.EmpName ?? string.Empty)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(_config["Jwt:ExpiryMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task LogLoginAttemptAsync(string email, int? employeeId, bool success, string message, string ipAddress)
        {
            try
            {
                var timestamp = DateTime.UtcNow.ToString("O");
                var empIdString = employeeId.HasValue ? employeeId.ToString() : "N/A";
                var logEntry = $"[{timestamp}] Email={email}, EmployeeId={empIdString}, Success={success}, Message={message}, IpAddress={ipAddress}";
                
                await File.AppendAllTextAsync(_logFilePath, logEntry + Environment.NewLine);
            }
            catch (Exception ex)
            {
                // Log to console if file logging fails
                Console.WriteLine($"Error logging login attempt: {ex.Message}");
            }
        }

        public async Task LogLogoutAsync(string email, int employeeId, string ipAddress)
        {
            try
            {
                var timestamp = DateTime.UtcNow.ToString("O");
                var logEntry = $"[{timestamp}] Email={email}, EmployeeId={employeeId}, Success=True, Message=Logout successful, IpAddress={ipAddress}";
                
                await File.AppendAllTextAsync(_logFilePath, logEntry + Environment.NewLine);
            }
            catch (Exception ex)
            {
                // Log to console if file logging fails
                Console.WriteLine($"Error logging logout: {ex.Message}");
            }
        }
    }
}