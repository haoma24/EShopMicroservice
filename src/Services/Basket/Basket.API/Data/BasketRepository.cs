

namespace Basket.API.Data
{
    public class BasketRepository(IDocumentSession session) : IBasketRepository
    {
        public async Task<ShoppingCart?> GetBasket(string userName, CancellationToken cancellationToken = default)
        {
            // A missing basket is a normal state (first-time user, or just after checkout
            // clears it), so return null and let callers decide instead of throwing.
            return await session.LoadAsync<ShoppingCart>(userName, cancellationToken);
        }

        public async Task<ShoppingCart> StoreBasket(ShoppingCart cart, CancellationToken cancellationToken = default)
        {
            session.Store(cart);
            await session.SaveChangesAsync(cancellationToken);
            return cart;
        }

        public async Task<bool> DeleteBasket(string userName, CancellationToken cancellationToken = default)
        {
            session.Delete<ShoppingCart>(userName);
            await session.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
