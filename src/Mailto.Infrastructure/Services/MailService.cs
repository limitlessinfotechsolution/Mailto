using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Mailto.Infrastructure.Services
{
    public class MailService
    {
        private readonly MailtoDbContext _context;

        public MailService(MailtoDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmailMessage>> GetInboxAsync(Guid tenantId)
        {
            return await _context.Emails
                .Where(e => e.TenantId == tenantId && e.Folder == "Inbox")
                .OrderByDescending(e => e.SentAt)
                .ToListAsync();
        }

        public async Task SendEmailAsync(EmailMessage email)
        {
            _context.Emails.Add(email);
            await _context.SaveChangesAsync();
        }
    }
}
