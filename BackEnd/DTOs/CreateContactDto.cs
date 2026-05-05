using System.ComponentModel.DataAnnotations;

namespace BackEnd.DTOs
{
    public class CreateContactDto
    {
        [Required, MaxLength(255)]
        public string? Name { get; set; }

        [Required, EmailAddress, MaxLength(255)]
        public string? Email { get; set; }

        [Required, MaxLength(50)]
        public string? Category { get; set; }

        [Required, MaxLength(255)]
        public string? Subject { get; set; }

        [Required]
        public string? Message { get; set; }
    }

    public class ContactResponseDto
    {
        public int ContactId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Category { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsRead { get; set; }
        public string? Response { get; set; }
        public DateTime? ResponseDate { get; set; }
    }

    public class ContactSubmitResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public int? ContactId { get; set; }
    }
}
