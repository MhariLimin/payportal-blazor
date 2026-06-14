using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PayPortal.Infrastructure.Persistence;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PortalDbContext>
{
    public PortalDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("PAYPORTAL_CONNECTION")
            ?? "Server=localhost;Port=3306;Database=payportal;User=payportal;Password=payportal;";
        var options = new DbContextOptionsBuilder<PortalDbContext>()
            .UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)))
            .Options;
        return new PortalDbContext(options);
    }
}
