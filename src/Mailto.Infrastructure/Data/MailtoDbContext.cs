using Microsoft.EntityFrameworkCore;
using Mailto.Core.Entities;

namespace Mailto.Infrastructure.Data
{
    public class MailtoDbContext : DbContext
    {
        public MailtoDbContext(DbContextOptions<MailtoDbContext> options) : base(options)
        {
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<EmailMessage> Emails { get; set; }
        public DbSet<Domain> Domains { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Tenant>().HasKey(t => t.TenantId);
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
            modelBuilder.Entity<EmailMessage>().HasKey(e => e.EmailId);
            modelBuilder.Entity<Domain>().HasKey(d => d.DomainId);
            modelBuilder.Entity<AuditLog>().HasKey(a => a.AuditLogId);
        }
    }
}
