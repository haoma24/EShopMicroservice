namespace Ordering.Domain.ValueObjects
{
    public record Payment
    {
        public string? CardName { get; init; }
        public string CardNumber { get; init; } = default!;
        public string Expiration { get; init; } = default!;
        public string Cvv { get; init; } = default!;
        public int PaymentMethod { get; init; }

        private Payment() { }

        public static Payment Of(string? cardName, string cardNumber, string expiration, string cvv, int paymentMethod)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(cardNumber);
            ArgumentException.ThrowIfNullOrWhiteSpace(expiration);
            ArgumentException.ThrowIfNullOrWhiteSpace(cvv);

            return new Payment
            {
                CardName = cardName,
                CardNumber = cardNumber,
                Expiration = expiration,
                Cvv = cvv,
                PaymentMethod = paymentMethod
            };
        }
    }
}
