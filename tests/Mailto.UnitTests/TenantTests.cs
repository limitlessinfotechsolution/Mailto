using Mailto.Core.Entities;
using Xunit;

namespace Mailto.UnitTests
{
    public class TenantTests
    {
        [Fact]
        public void Tenant_CanBeInitialized()
        {
            var tenant = new Tenant { CompanyName = "Test" };
            Assert.Equal("Test", tenant.CompanyName);
        }
    }
}
