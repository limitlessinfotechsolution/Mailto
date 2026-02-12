using Xunit;
using Mailto.Infrastructure.Services;
using Mailto.Core.Entities;
using Mailto.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Mailto.UnitTests;

public class TenantServiceTests
{
    [Fact]
    public async Task CreateTenantAsync_AddsTenantToDatabase()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<MailtoDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new MailtoDbContext(options);
        var service = new TenantService(context);

        var tenant = new Tenant
        {
            CompanyName = "Test Corp",
            PrimaryDomain = "test.com"
        };

        // Act
        await service.CreateTenantAsync(tenant);

        // Assert
        Assert.NotEqual(Guid.Empty, tenant.TenantId);
        var savedTenant = await context.Tenants.FindAsync(tenant.TenantId);
        Assert.Equal("Test Corp", savedTenant.CompanyName);
    }
}

public class DnsVerificationServiceTests
{
    [Fact]
    public async Task VerifyDomainAsync_VerifiesExistingDomain()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<MailtoDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new MailtoDbContext(options);
        var service = new DnsVerificationService(context);

        var domain = new Domain { Name = "newdomain.com", VerificationToken = "token123" };
        context.Domains.Add(domain);
        await context.SaveChangesAsync();

        // Act
        var result = await service.VerifyDomainAsync(domain.DomainId);

        // Assert
        Assert.True(result);
        var updatedDomain = await context.Domains.FindAsync(domain.DomainId);
        Assert.True(updatedDomain.IsVerified);
    }
}
