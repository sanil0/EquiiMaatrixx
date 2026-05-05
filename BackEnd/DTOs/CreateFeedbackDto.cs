using System.ComponentModel.DataAnnotations;

namespace BackEnd.DTOs
{
    public class CreateFeedbackDto
    {
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
    }

    public class FeedbackResponseDto
    {
        public int FeedbackId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Type { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsRead { get; set; }
    }
}
