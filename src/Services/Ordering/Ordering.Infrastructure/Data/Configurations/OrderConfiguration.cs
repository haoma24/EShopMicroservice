using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ordering.Domain.Enums;
using Ordering.Domain.Models;
using Ordering.Domain.ValueObjects;

namespace Ordering.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id)
            .HasConversion(id => id.Value, value => OrderId.Of(value));

        builder.HasOne<Customer>()
            .WithMany()
            .HasForeignKey(o => o.CustomerId)
            .IsRequired();

        builder.Property(o => o.CustomerId)
            .HasConversion(id => id.Value, value => CustomerId.Of(value));

        builder.ComplexProperty(o => o.OrderName, nameBuilder =>
        {
            nameBuilder.Property(n => n.Value)
                .HasColumnName("OrderName")
                .HasMaxLength(50)
                .IsRequired();
        });

        builder.ComplexProperty(o => o.ShippingAddress, addressBuilder =>
        {
            addressBuilder.Property(a => a.FirstName).HasMaxLength(50).IsRequired();
            addressBuilder.Property(a => a.LastName).HasMaxLength(50).IsRequired();
            addressBuilder.Property(a => a.EmailAddress).HasMaxLength(50);
            addressBuilder.Property(a => a.AddressLine).HasMaxLength(180).IsRequired();
            addressBuilder.Property(a => a.Country).HasMaxLength(50);
            addressBuilder.Property(a => a.State).HasMaxLength(50);
            addressBuilder.Property(a => a.ZipCode).HasMaxLength(10).IsRequired();
        });

        builder.ComplexProperty(o => o.BillingAddress, addressBuilder =>
        {
            addressBuilder.Property(a => a.FirstName).HasMaxLength(50).IsRequired();
            addressBuilder.Property(a => a.LastName).HasMaxLength(50).IsRequired();
            addressBuilder.Property(a => a.EmailAddress).HasMaxLength(50);
            addressBuilder.Property(a => a.AddressLine).HasMaxLength(180).IsRequired();
            addressBuilder.Property(a => a.Country).HasMaxLength(50);
            addressBuilder.Property(a => a.State).HasMaxLength(50);
            addressBuilder.Property(a => a.ZipCode).HasMaxLength(10).IsRequired();
        });

        builder.ComplexProperty(o => o.Payment, paymentBuilder =>
        {
            paymentBuilder.Property(p => p.CardName).HasMaxLength(50);
            paymentBuilder.Property(p => p.CardNumber).HasMaxLength(24).IsRequired();
            paymentBuilder.Property(p => p.Expiration).HasMaxLength(10);
            paymentBuilder.Property(p => p.Cvv).HasMaxLength(3);
            paymentBuilder.Property(p => p.PaymentMethod);
        });

        builder.Property(o => o.Status)
            .HasDefaultValue(OrderStatus.Draft)
            .HasConversion<string>();

        builder.HasMany(o => o.OrderItems)
            .WithOne()
            .HasForeignKey(oi => oi.OrderId);

        builder.Navigation(o => o.OrderItems)
            .HasField("_orderItems");
    }
}
