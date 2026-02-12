using System;

namespace Mailto.Core.Entities
{
    public class Domain
    {
        public Guid DomainId { get; set; }
        public Guid TenantId { get; set; }
        public string Name { get; set; }
        public bool IsVerified { get; set; }
        public string VerificationToken { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
