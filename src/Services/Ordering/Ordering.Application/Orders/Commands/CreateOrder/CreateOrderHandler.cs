using Ordering.Application.Orders.Commands.CreataOrder;

namespace Ordering.Application.Orders.Commands.CreateOrder;

public class CreateOrderHandler(IApplicationDbContext dbContext)
    : ICommandHandler<CreateOrderCommand, CreateOrderResult>
{
    public async Task<CreateOrderResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = CreateNewOrder(request.Order);

        dbContext.Orders.Add(order);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new CreateOrderResult(order.Id.Value);
    }

    private static Order CreateNewOrder(OrderDto orderDto)
    {
        var shippingAddress = MapAddress(orderDto.ShippingAddress);
        var billingAddress = MapAddress(orderDto.BillingAddress);
        var payment = Payment.Of(
            orderDto.Payment.CardName,
            orderDto.Payment.CardNumber,
            orderDto.Payment.Expiration,
            orderDto.Payment.Cvv,
            orderDto.Payment.PaymentMethod);

        var order = Order.Create(
            OrderId.Of(Guid.NewGuid()),
            CustomerId.Of(orderDto.CustomerId),
            OrderName.Of(orderDto.OrderName),
            shippingAddress,
            billingAddress,
            payment);

        foreach (var item in orderDto.OrderItems)
            order.Add(ProductId.Of(item.ProductId), item.Quantity, item.Price);

        return order;
    }

    private static Address MapAddress(AddressDto dto) =>
        Address.Of(dto.FirstName, dto.LastName, dto.EmailAddress,
                   dto.AddressLine, dto.Country, dto.State, dto.ZipCode);
}
