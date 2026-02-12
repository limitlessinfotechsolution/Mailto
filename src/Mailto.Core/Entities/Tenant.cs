using System;

namespace Mailto.Core.Entities
{
    public class Tenant
    {
        public Guid TenantId { get; set; }
        public string CompanyName { get; set; }
        public string PrimaryDomain { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
