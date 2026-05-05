using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Contact
    {
        [Key]
        public int ContactId { get; set; }

        [Required, MaxLength(255)]
        public string? Name { get; set; }

        [Required, EmailAddress, MaxLength(255)]
        public string? Email { get; set; }

        [Required, MaxLength(50)]
        public string? Category { get; set; } // general, technical, awards, vesting, tax, account, other

        [Required, MaxLength(255)]
        public string? Subject { get; set; }

        [Required]
        public string? Message { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        [MaxLength(500)]
        public string? Response { get; set; } // For admin to track responses

        public DateTime? ResponseDate { get; set; }
    }
}
