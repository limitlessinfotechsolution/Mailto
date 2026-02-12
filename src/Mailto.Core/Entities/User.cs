using System;

namespace Mailto.Core.Entities
{
    public class User
    {
        public Guid UserId { get; set; }
        public Guid TenantId { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        public Tenant Tenant { get; set; }
    }
}
