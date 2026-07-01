using Marten.Schema;

namespace Catalog.API.Data
{
    public class CatalogInitialData : IInitialData
    {
        public async Task Populate(IDocumentStore store, CancellationToken cancellationToken)
        {
            await using var session = store.LightweightSession();

            if (await session.Query<Product>().AnyAsync(cancellationToken))
                return;

            session.Store(GetPreconfiguredProducts());
            await session.SaveChangesAsync(cancellationToken);
        }

        private static IEnumerable<Product> GetPreconfiguredProducts() =>
        [
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "IPhone X",
                Category = ["Smart Phone"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years. It includes a borderless.",
                ImageFile = "product-1.jpg",
                Price = 950.00M
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Samsung 10",
                Category = ["Smart Phone"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years.",
                ImageFile = "product-2.webp",
                Price = 840.00M
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Huawei Plus",
                Category = ["White Appliances"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years.",
                ImageFile = "product-3.webp",
                Price = 650.00M
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Xiaomi Mi 9",
                Category = ["White Appliances"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years.",
                ImageFile = "product-4.webp",
                Price = 470.00M
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "HTC U11+ Plus",
                Category = ["Smart Phone"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years.",
                ImageFile = "product-5.jpg",
                Price = 380.00M
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "LG G7 ThinQ",
                Category = ["Home Kitchen"],
                Description = "This phone is the company's biggest change to its flagship smartphone in years.",
                ImageFile = "product-6.jpg",
                Price = 240.00M
            }
        ];
    }
}
