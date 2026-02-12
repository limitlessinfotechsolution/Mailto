using Microsoft.AspNetCore.Mvc;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Services;

namespace Mailto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MailController : ControllerBase
    {
        private readonly MailService _mailService;

        public MailController(MailService mailService)
        {
            _mailService = mailService;
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox([FromQuery] Guid tenantId)
        {
            var emails = await _mailService.GetInboxAsync(tenantId);
            return Ok(emails);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailMessage email)
        {
            await _mailService.SendEmailAsync(email);
            return Ok();
        }
    }
}
