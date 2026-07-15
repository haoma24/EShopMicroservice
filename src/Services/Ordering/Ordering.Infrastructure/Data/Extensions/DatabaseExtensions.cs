using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Ordering.Infrastructure.Data.Extensions;

public static class DatabaseExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await WaitForDatabaseAsync(context, app.Logger);

        await context.Database.MigrateAsync();
        await SeedAsync(context);
    }

    // depends_on only waits for the orderdb container to start, not for SQL Server to
    // accept connections; the managed SNI can also throw transient connect errors
    // (error 35) during warm-up. Retry so a cold start doesn't crash the app.
    private static async Task WaitForDatabaseAsync(ApplicationDbContext context, ILogger logger)
    {
        const int maxAttempts = 10;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                if (await context.Database.CanConnectAsync())
                    return;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                logger.LogWarning(
                    ex,
                    "Database not ready (attempt {Attempt}/{MaxAttempts}); retrying...",
                    attempt, maxAttempts);
            }

            await Task.Delay(TimeSpan.FromSeconds(5));
        }
    }

    private static async Task SeedAsync(ApplicationDbContext context)
    {
        await SeedCustomersAsync(context);
        await SeedProductsAsync(context);
        await SeedOrdersAndItemsAsync(context);
    }

    private static async Task SeedCustomersAsync(ApplicationDbContext context)
    {
        if (await context.Customers.AnyAsync()) return;
        context.Customers.AddRange(InitialData.Customers);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync()) return;
        context.Products.AddRange(InitialData.Products);
        await context.SaveChangesAsync();
    }

    private static async Task SeedOrdersAndItemsAsync(ApplicationDbContext context)
    {
        if (await context.Orders.AnyAsync()) return;
        context.Orders.AddRange(InitialData.OrdersWithItems);
        await context.SaveChangesAsync();
}
}
