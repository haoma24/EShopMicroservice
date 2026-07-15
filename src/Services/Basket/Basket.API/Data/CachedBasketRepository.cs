using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace Basket.API.Data
{
    public class CachedBasketRepository(IBasketRepository repository, IDistributedCache cache) : IBasketRepository
    {
        public async Task<ShoppingCart?> GetBasket(string userName, CancellationToken cancellationToken = default)
        {
            var cached = await cache.GetStringAsync(userName, cancellationToken);
            if (cached is not null)
                return JsonSerializer.Deserialize<ShoppingCart>(cached)!;

            var basket = await repository.GetBasket(userName, cancellationToken);
            if (basket is null)
                return null;

            await cache.SetStringAsync(userName, JsonSerializer.Serialize(basket), cancellationToken);
            return basket;
        }

        public async Task<ShoppingCart> StoreBasket(ShoppingCart cart, CancellationToken cancellationToken = default)
        {
            await repository.StoreBasket(cart, cancellationToken);
            await cache.SetStringAsync(cart.UserName, JsonSerializer.Serialize(cart), cancellationToken);
            return cart;
        }

        public async Task<bool> DeleteBasket(string userName, CancellationToken cancellationToken = default)
        {
            await repository.DeleteBasket(userName, cancellationToken);
            await cache.RemoveAsync(userName, cancellationToken);
            return true;
        }
    }
}
