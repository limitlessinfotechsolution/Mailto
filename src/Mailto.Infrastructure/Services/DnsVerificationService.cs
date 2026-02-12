using System;
using System.Linq;
using System.Threading.Tasks;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Mailto.Infrastructure.Services
{
    public class DnsVerificationService
    {
        private readonly MailtoDbContext _context;

        public DnsVerificationService(MailtoDbContext context)
        {
            _context = context;
        }

        public async Task<bool> VerifyDomainAsync(Guid domainId)
        {
            var domain = await _context.Domains.FindAsync(domainId);
            if (domain == null) return false;

            // Logic to perform actual DNS lookup would go here.
            // For MVP, we simulate verification.
            domain.IsVerified = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Domain> AddDomainAsync(Domain domain)
        {
            domain.VerificationToken = Guid.NewGuid().ToString();
            _context.Domains.Add(domain);
            await _context.SaveChangesAsync();
            return domain;
        }
    }
}
