namespace Ordering.Domain.ValueObjects
{
    public record Address
    {
        public string FirstName { get; init; } = default!;
        public string LastName { get; init; } = default!;
        public string EmailAddress { get; init; } = default!;
        public string AddressLine { get; init; } = default!;
        public string Country { get; init; } = default!;
        public string State { get; init; } = default!;
        public string ZipCode { get; init; } = default!;

        private Address() { }

        public static Address Of(string firstName, string lastName, string emailAddress, string addressLine, string country, string state, string zipCode)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
            ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
            ArgumentException.ThrowIfNullOrWhiteSpace(emailAddress);
            ArgumentException.ThrowIfNullOrWhiteSpace(addressLine);
            ArgumentException.ThrowIfNullOrWhiteSpace(country);
            ArgumentException.ThrowIfNullOrWhiteSpace(state);
            ArgumentException.ThrowIfNullOrWhiteSpace(zipCode);

            return new Address
            {
                FirstName = firstName,
                LastName = lastName,
                EmailAddress = emailAddress,
                AddressLine = addressLine,
                Country = country,
                State = state,
                ZipCode = zipCode
            };
        }
    }
}
