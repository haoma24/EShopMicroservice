namespace Ordering.Domain.ValueObjects
{
    public record OrderId
    {
        public Guid Value { get; }

        private OrderId(Guid value) => Value = value;

        public static OrderId Of(Guid value)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(value.ToString());
            if (value == Guid.Empty)
                throw new ArgumentException("OrderId cannot be empty.", nameof(value));
            return new OrderId(value);
        }
    }
}
