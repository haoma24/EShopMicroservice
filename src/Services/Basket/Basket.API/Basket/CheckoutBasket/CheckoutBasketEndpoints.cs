using Carter;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Basket.API.Basket.CheckoutBasket
{
    public record CheckoutBasketRequest(
        string UserName, Guid CustomerId,
        string FirstName, string LastName, string EmailAddress,
        string AddressLine, string Country, string State, string ZipCode,
        string CardName, string CardNumber, string Expiration, string CVV, int PaymentMethod);

    public record CheckoutBasketResponse(bool IsSuccess);

    public class CheckoutBasketEndpoints : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/basket/checkout", async (CheckoutBasketRequest request, [FromServices] ISender sender) =>
            {
                var command = request.Adapt<CheckoutBasketCommand>();
                var result = await sender.Send(command);
                var response = result.Adapt<CheckoutBasketResponse>();
                return Results.Ok(response);
            })
            .WithName("CheckoutBasket")
            .Produces<CheckoutBasketResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Checkout Basket")
            .WithDescription("Checkout Basket");
        }
    }
}
