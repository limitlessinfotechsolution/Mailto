using System;

namespace Mailto.Core.Entities
{
    public class EmailMessage
    {
        public Guid EmailId { get; set; }
        public Guid TenantId { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required string Subject { get; set; }
        public required string Body { get; set; }
        public required string Folder { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; }
    }
}
