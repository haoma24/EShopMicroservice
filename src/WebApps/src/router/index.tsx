import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { Home } from '@/pages/home/Home'
import { Basket } from '@/pages/basket/Basket'
import { ProductDetail } from '@/pages/product-detail/ProductDetail'
import { Checkout } from '@/pages/checkout/Checkout'
import { OrderSubmitted } from '@/pages/order-submitted/OrderSubmitted'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'basket', element: <Basket /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-submitted', element: <OrderSubmitted /> },
    ],
  },
])
