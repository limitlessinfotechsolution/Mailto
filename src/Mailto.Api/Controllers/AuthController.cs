using Microsoft.AspNetCore.Mvc;
using Mailto.Core.Entities;

namespace Mailto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Simple mock login
            return Ok(new { Token = "mock-jwt-token" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // Simple mock register
            return Ok();
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
