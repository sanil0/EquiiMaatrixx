using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace BackEnd.Services
{
    public interface IEmailService
    {
        Task<bool> SendOtpEmailAsync(string email, string otpCode, string empName);
        Task<bool> SendPasswordResetConfirmationAsync(string email, string empName);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public EmailService(IConfiguration config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        public async Task<bool> SendOtpEmailAsync(string email, string otpCode, string empName)
        {
            try
            {
                var brevoApiKey = _config["EmailSettings:BrevoApiKey"];
                var senderEmail = _config["EmailSettings:EmailAddress"];
                var senderName = "EquiMatrix Support";

                if (string.IsNullOrEmpty(brevoApiKey))
                {
                    Console.WriteLine("Error: Brevo API key not configured");
                    return false;
                }

                var htmlContent = GetOtpEmailHtml(empName, otpCode);

                var payload = new
                {
                    sender = new { name = senderName, email = senderEmail },
                    to = new[] { new { email = email, name = empName } },
                    subject = "Password Reset OTP - EquiMatrix",
                    htmlContent = htmlContent
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("api-key", brevoApiKey);

                var response = await _httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"OTP email sent successfully to {email}");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Brevo API error: {response.StatusCode} - {errorContent}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending OTP email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }

        public async Task<bool> SendPasswordResetConfirmationAsync(string email, string empName)
        {
            try
            {
                var brevoApiKey = _config["EmailSettings:BrevoApiKey"];
                var senderEmail = _config["EmailSettings:EmailAddress"];
                var senderName = "EquiMatrix Support";

                if (string.IsNullOrEmpty(brevoApiKey))
                {
                    Console.WriteLine("Error: Brevo API key not configured");
                    return false;
                }

                var htmlContent = GetConfirmationEmailHtml(empName);

                var payload = new
                {
                    sender = new { name = senderName, email = senderEmail },
                    to = new[] { new { email = email, name = empName } },
                    subject = "Password Reset Successful - EquiMatrix",
                    htmlContent = htmlContent
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("api-key", brevoApiKey);

                var response = await _httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Confirmation email sent successfully to {email}");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Brevo API error: {response.StatusCode} - {errorContent}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending confirmation email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }

        private string GetOtpEmailHtml(string empName, string otpCode)
        {
            return $@"<html><body style='font-family: Arial, sans-serif;'><h2>Password Reset Request</h2><p>Hi {empName},</p><p>We received a request to reset your password. Use the OTP below:</p><div style='background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px;'><h1 style='color: #333; letter-spacing: 2px;'>{otpCode}</h1></div><p><strong>OTP Valid for 10 minutes only.</strong></p><p>If you didn't request this, please ignore this email.</p><p>Best regards,<br/>EquiMatrix Team</p></body></html>";
        }

        private string GetConfirmationEmailHtml(string empName)
        {
            return $@"<html><body style='font-family: Arial, sans-serif;'><h2>Password Reset Successful</h2><p>Hi {empName},</p><p>Your password has been successfully reset.</p><p>You can now log in with your new password.</p><p>If you didn't make this change, contact support immediately.</p><p>Best regards,<br/>EquiMatrix Team</p></body></html>";
        }
    }
}
