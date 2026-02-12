using System;

namespace Mailto.Core.Entities
{
    public class AuditLog
    {
        public Guid AuditLogId { get; set; }
        public Guid? TenantId { get; set; }
        public Guid? UserId { get; set; }
        public string Action { get; set; }
        public string Details { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
