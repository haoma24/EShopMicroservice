using Ordering.Application.Exceptions;

namespace Ordering.Application.Orders.Commands.UpdateOrder;

public class UpdateOrderHandler(IApplicationDbContext dbContext)
    : ICommandHandler<UpdateOrderCommand, UpdateOrderResult>
{
    public async Task<UpdateOrderResult> Handle(UpdateOrderCommand command, CancellationToken cancellationToken)
    {
        var orderId = OrderId.Of(command.Order.Id);
        var order = await dbContext.Orders
            .FindAsync([orderId], cancellationToken: cancellationToken);

        if (order is null)
            throw new OrderNotFoundException(command.Order.Id);

        UpdateOrderWithNewValues(order, command.Order);

        dbContext.Orders.Update(order);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateOrderResult(true);
    }

    private static void UpdateOrderWithNewValues(Order order, OrderDto dto)
    {
        var shippingAddress = Address.Of(dto.ShippingAddress.FirstName, dto.ShippingAddress.LastName,
            dto.ShippingAddress.EmailAddress, dto.ShippingAddress.AddressLine,
            dto.ShippingAddress.Country, dto.ShippingAddress.State, dto.ShippingAddress.ZipCode);

        var billingAddress = Address.Of(dto.BillingAddress.FirstName, dto.BillingAddress.LastName,
            dto.BillingAddress.EmailAddress, dto.BillingAddress.AddressLine,
            dto.BillingAddress.Country, dto.BillingAddress.State, dto.BillingAddress.ZipCode);

        var payment = Payment.Of(dto.Payment.CardName, dto.Payment.CardNumber,
            dto.Payment.Expiration, dto.Payment.Cvv, dto.Payment.PaymentMethod);

        order.Update(
            OrderName.Of(dto.OrderName),
            shippingAddress,
            billingAddress,
            payment,
            dto.Status);
    }
}
