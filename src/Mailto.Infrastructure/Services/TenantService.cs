using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Mailto.Infrastructure.Services
{
    public class TenantService
    {
        private readonly MailtoDbContext _context;

        public TenantService(MailtoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tenant>> GetAllTenantsAsync()
        {
            return await _context.Tenants.ToListAsync();
        }

        public async Task<Tenant?> GetTenantByIdAsync(Guid tenantId)
        {
            return await _context.Tenants.FindAsync(tenantId);
        }

        public async Task CreateTenantAsync(Tenant tenant)
        {
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();
        }
    }
}
