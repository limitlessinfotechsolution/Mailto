using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Mailto.Api.Middleware
{
    public class TenantResolutionMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantResolutionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Resolve tenant from header, domain or subdomain
            if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantId))
            {
                context.Items["TenantId"] = tenantId.ToString();
            }

            await _next(context);
        }
    }
}
