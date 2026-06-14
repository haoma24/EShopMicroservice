namespace Catalog.API.Products.GetProductByCategory
{
    //public record GetProductByCategoryRequest();
    public record GetProductByCategoryResponse(IEnumerable<Product> Products);

    public class GetProductByCategoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/products/category/{category}",
                async (string category, ISender sender, IMapper mapper) =>
                {
                    var result = await sender.Send(new GetProductByCategoryQuery(category));

                    var response = mapper.Map<GetProductByCategoryResponse>(result);

                    return Results.Ok(response);
                })
            .WithName("GetProductByCategory")
            .Produces<GetProductByCategoryResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Get Product By Category")
            .WithDescription("Get Product By Category");
        }
    }
}
