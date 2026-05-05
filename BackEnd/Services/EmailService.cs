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
        Task<bool> SendFeedbackEmailAsync(string name, string userEmail, string type, string subject, string message, int rating);
        Task<bool> SendContactEmailAsync(string name, string userEmail, string category, string subject, string message);
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

        public async Task<bool> SendFeedbackEmailAsync(string name, string userEmail, string type, string subject, string message, int rating)
        {
            try
            {
                var brevoApiKey = _config["EmailSettings:BrevoApiKey"];
                var senderEmail = _config["EmailSettings:EmailAddress"];
                var senderName = "EquiMatrix Support";
                var adminEmail = "sanilprajwal2@gmail.com"; // Admin email to receive feedback

                if (string.IsNullOrEmpty(brevoApiKey))
                {
                    Console.WriteLine("Error: Brevo API key not configured");
                    return false;
                }

                var htmlContent = GetFeedbackEmailHtml(name, userEmail, type, subject, message, rating);

                var payload = new
                {
                    sender = new { name = senderName, email = senderEmail },
                    to = new[] { new { email = adminEmail, name = "EquiMatrix Admin" } },
                    replyTo = new { email = userEmail, name = name },
                    subject = $"[{type.ToUpper()}] Feedback from {name}: {subject}",
                    htmlContent = htmlContent
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("api-key", brevoApiKey);

                var response = await _httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Feedback email sent successfully from {userEmail}");
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
                Console.WriteLine($"Error sending feedback email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }

        public async Task<bool> SendContactEmailAsync(string name, string userEmail, string category, string subject, string message)
        {
            try
            {
                var brevoApiKey = _config["EmailSettings:BrevoApiKey"];
                var senderEmail = _config["EmailSettings:EmailAddress"];
                var senderName = "EquiMatrix Support";
                var adminEmail = "sanilprajwal2@gmail.com"; // Admin email to receive contact requests

                if (string.IsNullOrEmpty(brevoApiKey))
                {
                    Console.WriteLine("Error: Brevo API key not configured");
                    return false;
                }

                var htmlContent = GetContactEmailHtml(name, userEmail, category, subject, message);

                var payload = new
                {
                    sender = new { name = senderName, email = senderEmail },
                    to = new[] { new { email = adminEmail, name = "EquiMatrix Support" } },
                    replyTo = new { email = userEmail, name = name },
                    subject = $"[CONTACT] {category.ToUpper()} - {subject} from {name}",
                    htmlContent = htmlContent
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("api-key", brevoApiKey);

                var response = await _httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Contact email sent successfully from {userEmail}");
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
                Console.WriteLine($"Error sending contact email: {ex.Message}");
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

        private string GetFeedbackEmailHtml(string name, string userEmail, string type, string subject, string message, int rating)
        {
            var ratingStars = string.Concat(Enumerable.Range(0, rating).Select(_ => "★")) + string.Concat(Enumerable.Range(rating, 5 - rating).Select(_ => "☆"));
            
            return $@"
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
        .content {{ background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }}
        .field {{ margin-bottom: 15px; }}
        .field-label {{ font-weight: bold; color: #1e293b; }}
        .field-value {{ color: #64748b; margin-top: 5px; padding: 8px; background: white; border-left: 3px solid #06b6d4; }}
        .rating {{ font-size: 24px; color: #fbbf24; }}
        .footer {{ text-align: center; padding: 15px; font-size: 12px; color: #94a3b8; background: #f1f5f9; border-radius: 0 0 5px 5px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2 style='margin: 0;'>New Feedback Received</h2>
            <p style='margin: 5px 0 0 0; opacity: 0.9;'>From EquiMatrix User</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>From:</div>
                <div class='field-value'>{name} ({userEmail})</div>
            </div>
            <div class='field'>
                <div class='field-label'>Feedback Type:</div>
                <div class='field-value' style='text-transform: capitalize;'>{type}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>{subject}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Rating:</div>
                <div class='field-value rating'>{ratingStars}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value' style='white-space: pre-wrap; line-height: 1.6;'>{System.Net.WebUtility.HtmlEncode(message)}</div>
            </div>
        </div>
        <div class='footer'>
            <p style='margin: 0;'>Sent from EquiMatrix Feedback Form</p>
            <p style='margin: 5px 0 0 0;'>To reply, use the reply button to respond directly to {userEmail}</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetContactEmailHtml(string name, string userEmail, string category, string subject, string message)
        {
            return $@"
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
        .content {{ background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }}
        .field {{ margin-bottom: 15px; }}
        .field-label {{ font-weight: bold; color: #1e293b; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }}
        .field-value {{ color: #64748b; margin-top: 5px; padding: 8px; background: white; border-left: 3px solid #06b6d4; }}
        .category-badge {{ display: inline-block; background: #06b6d4; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }}
        .footer {{ text-align: center; padding: 15px; font-size: 12px; color: #94a3b8; background: #f1f5f9; border-radius: 0 0 5px 5px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2 style='margin: 0;'>New Contact Request</h2>
            <p style='margin: 5px 0 0 0; opacity: 0.9;'>From EquiMatrix User</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>From:</div>
                <div class='field-value'>{name} ({userEmail})</div>
            </div>
            <div class='field'>
                <div class='field-label'>Category:</div>
                <div class='field-value'><span class='category-badge'>{category.ToUpper()}</span></div>
            </div>
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>{subject}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value' style='white-space: pre-wrap; line-height: 1.6;'>{System.Net.WebUtility.HtmlEncode(message)}</div>
            </div>
        </div>
        <div class='footer'>
            <p style='margin: 0;'>Contact request from EquiMatrix Support Form</p>
            <p style='margin: 5px 0 0 0;'>To reply, use the reply button to respond directly to {userEmail}</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}

