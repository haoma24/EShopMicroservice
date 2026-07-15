import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
          EShop
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Products
          </Link>
          <Link to="/orders" className="hover:text-gray-900">
            Orders
          </Link>
          <Link to="/basket" className="hover:text-gray-900">
            Basket
          </Link>
        </nav>
      </div>
    </header>
  )
}
