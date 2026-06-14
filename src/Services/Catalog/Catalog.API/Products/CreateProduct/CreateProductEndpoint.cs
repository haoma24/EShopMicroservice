
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
namespace Catalog.API.Products.CreateProduct
{
    public record CreateProductRequest(string Name, List<string> Category, string Description, string ImageFile, decimal Price);
    public record CreateProductResponse(Guid Id);
    public class CreateProductEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {

            app.MapPost("/products", async (CreateProductRequest request, [FromServices] ISender sender, [FromServices] IMapper mapper) =>
            {
                var command = mapper.Map<CreateProductCommand>(request);
                var result = await sender.Send(command);
                var response = mapper.Map<CreateProductResponse>(result);
                return Results.Created($"/products/{response.Id}", response);
            })
            .WithName("CreateProduct")
            .Produces<CreateProductResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Creates a new product")
            .WithDescription("Creates a new product with the provided details.");
        }
    }
}