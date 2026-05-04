namespace BackEnd.DTOs
{
    public class SendOtpRequestDto
    {
        public string? Email { get; set; }
    }

    public class SendOtpResponseDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class VerifyOtpRequestDto
    {
        public string? Email { get; set; }
        public string? OtpCode { get; set; }
    }

    public class VerifyOtpResponseDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? VerificationToken { get; set; }
    }

    public class ResetPasswordRequestDto
    {
        public string? Email { get; set; }
        public string? NewPassword { get; set; }
        public string? ConfirmPassword { get; set; }
        public string? VerificationToken { get; set; }
    }

    public class ResetPasswordResponseDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
