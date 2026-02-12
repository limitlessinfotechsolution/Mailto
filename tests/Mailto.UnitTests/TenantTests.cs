using Mailto.Core.Entities;
using Xunit;

namespace Mailto.UnitTests
{
    public class TenantTests
    {
        [Fact]
        public void Tenant_CanBeInitialized()
        {
            var tenant = new Tenant { CompanyName = "Test", PrimaryDomain = "test.com" };
            Assert.Equal("Test", tenant.CompanyName);
            Assert.Equal("test.com", tenant.PrimaryDomain);
        }
    }
}
