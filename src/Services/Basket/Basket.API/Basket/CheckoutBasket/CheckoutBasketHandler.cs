using Basket.API.Data;
using BuildingBlocks.Messaging.Events;
using FluentValidation;
using Mapster;
using MassTransit;

namespace Basket.API.Basket.CheckoutBasket
{
    public record CheckoutBasketCommand(
        string UserName, Guid CustomerId,
        string FirstName, string LastName, string EmailAddress,
        string AddressLine, string Country, string State, string ZipCode,
        string CardName, string CardNumber, string Expiration, string CVV, int PaymentMethod)
        : ICommand<CheckoutBasketResult>;

    public record CheckoutBasketResult(bool IsSuccess);

    public class CheckoutBasketCommandValidator : AbstractValidator<CheckoutBasketCommand>
    {
        public CheckoutBasketCommandValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("CustomerId is required");
        }
    }

    internal class CheckoutBasketCommandHandler(
        IBasketRepository repository,
        IPublishEndpoint publishEndpoint)
        : ICommandHandler<CheckoutBasketCommand, CheckoutBasketResult>
    {
        public async Task<CheckoutBasketResult> Handle(CheckoutBasketCommand command, CancellationToken cancellationToken)
        {
            var basket = await repository.GetBasket(command.UserName, cancellationToken);
            if (basket == null) return new CheckoutBasketResult(false);

            var eventMessage = command.Adapt<BasketCheckoutEvent>();
            eventMessage = eventMessage with
            {
                TotalPrice = basket.TotalPrice,
                Items = basket.Items
                    .Select(i => new BasketCheckoutEventItem(i.ProductId, i.Quantity, i.Price))
                    .ToList()
            };

            await publishEndpoint.Publish(eventMessage, cancellationToken);
            await repository.DeleteBasket(command.UserName, cancellationToken);

            return new CheckoutBasketResult(true);
        }
    }
}
