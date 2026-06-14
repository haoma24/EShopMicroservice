namespace Ordering.Domain.Models
{
    public class OrderItem : Entity<OrderItemId>
    {
        public OrderId OrderId { get; private set; } = default!;
        public ProductId ProductId { get; private set; } = default!;
        public int Quantity { get; private set; } = default;
        public decimal Price { get; private set; } = default;

        internal static OrderItem Create(OrderId orderId, ProductId productId, int quantity, decimal price)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(price);

            return new OrderItem
            {
                Id = OrderItemId.Of(Guid.NewGuid()),
                OrderId = orderId,
                ProductId = productId,
                Quantity = quantity,
                Price = price
            };
        }
    }
}
