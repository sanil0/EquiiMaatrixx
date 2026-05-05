using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [Required, MaxLength(255)]
        public string? Name { get; set; }

        [Required, EmailAddress, MaxLength(255)]
        public string? Email { get; set; }

        [Required, MaxLength(50)]
        public string? Type { get; set; } // suggestion, improvement, bug, feedback, other

        [Required, MaxLength(255)]
        public string? Subject { get; set; }

        [Required]
        public string? Message { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;
    }
}
