namespace Ordering.API.Endpoints;

public record UpdateOrderRequest(OrderDto Order);
public record UpdateOrderResponse(bool IsSuccess);

public class UpdateOrder : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/orders/{id}", async (Guid id, UpdateOrderRequest request, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new UpdateOrderCommand(request.Order));
            return Results.Ok(new UpdateOrderResponse(result.IsSuccess));
        })
        .WithName("UpdateOrder")
        .Produces<UpdateOrderResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Update Order")
        .WithDescription("Update Order");
    }
}
