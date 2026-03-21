import { render, screen } from '@testing-library/react';
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
  expect(screen.getByText(/welcome to our shop/i)).toBeInTheDocument();
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

  expect(screen.getByRole('link', { name: /cart \(0\)/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(screen.getByRole('link', { name: /cart \(1\)/i })).toBeInTheDocument();
});
