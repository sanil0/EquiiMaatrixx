using System;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Otp
    {
        [Key]
        public int OtpId { get; set; }

        [Required, MaxLength(45)]
        public string? Email { get; set; }

        [Required, MaxLength(6)]
        public string? OtpCode { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsVerified { get; set; } = false;

        [MaxLength(255)]
        public string? VerificationToken { get; set; }
    }
}
