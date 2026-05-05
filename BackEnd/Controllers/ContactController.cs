using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using BackEnd.Services;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<ContactController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitContact([FromBody] CreateContactDto request)
        {
            try
            {
                // Validate request
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create contact record
                var contact = new Contact
                {
                    Name = request.Name,
                    Email = request.Email,
                    Category = request.Category,
                    Subject = request.Subject,
                    Message = request.Message,
                    CreatedDate = DateTime.UtcNow,
                    IsRead = false
                };

                // Save to database
                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();

                // Send email to admin
                var emailSent = await _emailService.SendContactEmailAsync(
                    request.Name,
                    request.Email,
                    request.Category,
                    request.Subject,
                    request.Message
                );

                _logger.LogInformation($"Contact request submitted by {request.Email}. Email sent: {emailSent}");

                return Ok(new ContactSubmitResponse
                {
                    Success = true,
                    Message = "Thank you for contacting us! We have received your message and will respond shortly.",
                    ContactId = contact.ContactId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error submitting contact request: {ex.Message}");
                return StatusCode(500, new ContactSubmitResponse
                {
                    Success = false,
                    Message = "An error occurred while processing your request. Please try again."
                });
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAllContacts()
        {
            try
            {
                var contacts = await _context.Contacts
                    .OrderByDescending(c => c.CreatedDate)
                    .Select(c => new ContactResponseDto
                    {
                        ContactId = c.ContactId,
                        Name = c.Name,
                        Email = c.Email,
                        Category = c.Category,
                        Subject = c.Subject,
                        Message = c.Message,
                        CreatedDate = c.CreatedDate,
                        IsRead = c.IsRead,
                        Response = c.Response,
                        ResponseDate = c.ResponseDate
                    })
                    .ToListAsync();

                return Ok(contacts);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving contact list: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving contacts" });
            }
        }

        [HttpPut("{id}/mark-read")]
        public async Task<IActionResult> MarkContactAsRead(int id)
        {
            try
            {
                var contact = await _context.Contacts.FindAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact request not found" });
                }

                contact.IsRead = true;
                _context.Contacts.Update(contact);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Contact marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error marking contact as read: {ex.Message}");
                return StatusCode(500, new { message = "Error updating contact" });
            }
        }

        [HttpPut("{id}/respond")]
        public async Task<IActionResult> RespondToContact(int id, [FromBody] dynamic request)
        {
            try
            {
                var contact = await _context.Contacts.FindAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact request not found" });
                }

                string response = request?.response;
                if (string.IsNullOrEmpty(response))
                {
                    return BadRequest(new { message = "Response message is required" });
                }

                contact.Response = response;
                contact.ResponseDate = DateTime.UtcNow;
                contact.IsRead = true;
                _context.Contacts.Update(contact);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Response saved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error responding to contact: {ex.Message}");
                return StatusCode(500, new { message = "Error saving response" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            try
            {
                var contact = await _context.Contacts.FindAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact request not found" });
                }

                _context.Contacts.Remove(contact);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Contact deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting contact: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting contact" });
            }
        }
    }
}
