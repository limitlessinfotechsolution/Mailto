using System;

namespace Mailto.Core.Entities
{
    public class AuditLog
    {
        public Guid AuditLogId { get; set; }
        public Guid TenantId { get; set; }
        public Guid? UserId { get; set; }
        public required string Action { get; set; }
        public required string Details { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
