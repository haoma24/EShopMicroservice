using BuildingBlocks.Messaging.Events;
using MassTransit;
using MediatR;
using Ordering.Application.Orders.Commands.CreataOrder;
using Ordering.Domain.Enums;

namespace Ordering.Application.Orders.EventHandlers.Integration;

public class BasketCheckoutEventHandler(ISender sender)
    : IConsumer<BasketCheckoutEvent>
{
    public async Task Consume(ConsumeContext<BasketCheckoutEvent> context)
    {
        var command = MapToCreateOrderCommand(context.Message);
        await sender.Send(command);
    }

    private static CreateOrderCommand MapToCreateOrderCommand(BasketCheckoutEvent message)
    {
        var address = new AddressDto(
            message.FirstName, message.LastName, message.EmailAddress,
            message.AddressLine, message.Country, message.State, message.ZipCode);

        var payment = new PaymentDto(
            message.CardName, message.CardNumber,
            message.Expiration, message.CVV, message.PaymentMethod);

        var orderId = Guid.NewGuid();

        var order = new OrderDto(
            Id: orderId,
            CustomerId: message.CustomerId,
            OrderName: message.UserName,
            ShippingAddress: address,
            BillingAddress: address,
            Payment: payment,
            Status: OrderStatus.Pending,
            OrderItems: message.Items
                .Select(i => new OrderItemDto(orderId, i.ProductId, i.Quantity, i.Price))
                .ToList());

        return new CreateOrderCommand(order);
    }
}
