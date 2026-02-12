using Microsoft.AspNetCore.Mvc;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Services;

namespace Mailto.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly TenantService _tenantService;

        public AdminController(TenantService tenantService)
        {
            _tenantService = tenantService;
        }

        [HttpGet("tenants")]
        public async Task<IActionResult> GetTenants()
        {
            var tenants = await _tenantService.GetAllTenantsAsync();
            return Ok(tenants);
        }

        [HttpPost("tenants")]
        public async Task<IActionResult> CreateTenant([FromBody] Tenant tenant)
        {
            await _tenantService.CreateTenantAsync(tenant);
            return Ok(tenant);
        }
    }
}
