using System;

namespace Mailto.Core.Entities
{
    public class EmailMessage
    {
        public Guid EmailId { get; set; }
        public Guid TenantId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string Folder { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
