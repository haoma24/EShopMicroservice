import { ErrorState } from '@/components/ErrorState'
import { useProducts } from './hooks/useProducts'
import { ProductGrid } from './components/ProductGrid'
import { ProductGridSkeleton } from './components/ProductGridSkeleton'

export function Home() {
  const { data: products, isLoading, isError, refetch } = useProducts()

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">Browse our latest catalog.</p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <ErrorState
          message="We couldn't load the products. Please try again."
          onRetry={() => refetch()}
        />
      ) : !products || products.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-500">No products available.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  )
}
