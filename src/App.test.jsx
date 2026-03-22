import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import products from './data/products';
import App from './App';

function renderApp(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('renders home page by default', () => {
  renderApp('/');
  expect(screen.getByText(/timeless pieces/i)).toBeInTheDocument();
});

it.each(products)('renders product page for $name', (product) => {
  renderApp(`/products/${product.id}`);
  expect(screen.getByText(new RegExp(product.name, 'i'))).toBeInTheDocument();
});

test('shows not found message for an unknown product id', () => {
  renderApp('/products/unknown');
  expect(screen.getByText(/product not found/i)).toBeInTheDocument();
});

test('renders cart page with empty state', () => {
  renderApp('/cart');
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test('adding a product updates the cart count in the header', () => {
  const firstProduct = products[0];
  renderApp(`/products/${firstProduct.id}`);

  // Badge is hidden when cart is empty (count === 0 renders no badge element)
  expect(screen.queryByText('1')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

  // Badge in the header shows the count (scoped to avoid matching qty controls in ProductCard)
  expect(within(screen.getByRole('banner')).getByText('1')).toBeInTheDocument();
});
