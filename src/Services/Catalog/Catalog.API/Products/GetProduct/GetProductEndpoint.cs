
using Mapster;

namespace Catalog.API.Products.GetProduct
{
    public record GetProductRequest(int? PageNumber = 1, int? PageSize = 10);
    public record GetProductsReponse(IEnumerable<Product> Products);
    public class GetProductEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/products", async ([AsParameters] GetProductRequest request, ISender sender, IMapper mapper) =>
            {
                var query = request.Adapt<GetProductsQuery>();
                var result = await sender.Send(query);

                var response = mapper.Map<GetProductsReponse>(result);
                return Results.Ok(response);
            })
                .WithName("GetProducts")
                .Produces<GetProductsReponse>(StatusCodes.Status400BadRequest)
                .WithSummary("Get Products")
                .WithDescription("Get Products");
        }
    }
}
