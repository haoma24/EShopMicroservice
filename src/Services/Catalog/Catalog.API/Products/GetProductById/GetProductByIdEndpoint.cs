
namespace Catalog.API.Products.GetProductById
{
    public record GetProductByIdResponse(Product Product);
    public class GetProductByIdEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/products/{id}", async (Guid id, ISender sender, IMapper mapper) =>
            {
                var result = await sender.Send(new GetProductByIdQuery(id));
                var response = mapper.Map<GetProductByIdResponse>(result);
                return Results.Ok(response);
            })
            .WithName("GetProductById")
            .Produces<GetProductByIdResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Product by Id")
            .WithDescription("Get a single product by its Id.");
        }
    }
}
