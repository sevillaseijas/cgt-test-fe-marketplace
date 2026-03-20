import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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

test('renders home page by default', () => {
  renderApp('/');
  expect(screen.getByText(/welcome to our shop/i)).toBeInTheDocument();
});

test('renders product page for a given product id', () => {
  renderApp('/products/a');
  expect(screen.getByText(/product a/i)).toBeInTheDocument();
});

test('renders cart page', () => {
  renderApp('/cart');
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
