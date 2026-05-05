using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using BackEnd.Services;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<FeedbackController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitFeedback([FromBody] CreateFeedbackDto request)
        {
            try
            {
                // Validate request
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Create feedback record
                var feedback = new Feedback
                {
                    Name = request.Name,
                    Email = request.Email,
                    Type = request.Type,
                    Subject = request.Subject,
                    Message = request.Message,
                    Rating = request.Rating,
                    CreatedDate = DateTime.UtcNow,
                    IsRead = false
                };

                // Save to database
                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                // Send email to admin
                var emailSent = await _emailService.SendFeedbackEmailAsync(
                    request.Name,
                    request.Email,
                    request.Type,
                    request.Subject,
                    request.Message,
                    request.Rating
                );

                _logger.LogInformation($"Feedback submitted by {request.Email}. Email sent: {emailSent}");

                return Ok(new
                {
                    success = true,
                    message = "Thank you for your feedback! We have received your submission.",
                    feedbackId = feedback.FeedbackId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error submitting feedback: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while processing your feedback. Please try again."
                });
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAllFeedback()
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .OrderByDescending(f => f.CreatedDate)
                    .Select(f => new FeedbackResponseDto
                    {
                        FeedbackId = f.FeedbackId,
                        Name = f.Name,
                        Email = f.Email,
                        Type = f.Type,
                        Subject = f.Subject,
                        Message = f.Message,
                        Rating = f.Rating,
                        CreatedDate = f.CreatedDate,
                        IsRead = f.IsRead
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving feedback list: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving feedback" });
            }
        }

        [HttpPut("{id}/mark-read")]
        public async Task<IActionResult> MarkFeedbackAsRead(int id)
        {
            try
            {
                var feedback = await _context.Feedbacks.FindAsync(id);
                if (feedback == null)
                {
                    return NotFound(new { message = "Feedback not found" });
                }

                feedback.IsRead = true;
                _context.Feedbacks.Update(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Feedback marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error marking feedback as read: {ex.Message}");
                return StatusCode(500, new { message = "Error updating feedback" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var feedback = await _context.Feedbacks.FindAsync(id);
                if (feedback == null)
                {
                    return NotFound(new { message = "Feedback not found" });
                }

                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Feedback deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting feedback: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting feedback" });
            }
        }
    }
}
