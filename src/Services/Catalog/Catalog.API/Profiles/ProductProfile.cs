using Catalog.API.Products.CreateProduct;
using Catalog.API.Products.GetProduct;
using Catalog.API.Products.GetProductByCategory;
using Catalog.API.Products.GetProductById;

namespace Catalog.API.Profiles
{
    public class ProductProfile:Profile
    {
        public ProductProfile()
        {
            CreateMap<CreateProductRequest, CreateProductCommand>();
            CreateMap<CreateProductResult, CreateProductResponse>();
            CreateMap<GetProductsResult, GetProductsReponse>();
            CreateMap<GetProductByCategoryResult, GetProductByCategoryResponse>();
            CreateMap<GetProductByIdResult, GetProductByIdResponse>();
        }
    }
}
