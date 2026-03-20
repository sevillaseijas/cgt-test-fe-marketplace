import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import CartPage from './CartPage';

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('shows empty message when cart has no items', () => {
  renderCartPage();
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test('renders all line items and the correct total when cart has products', () => {
  // Seed localStorage so CartProvider hydrates with existing items on mount.
  localStorage.setItem(
    'cart',
    JSON.stringify([
      { id: 'a', name: 'Product A', price: 10, quantity: 2 },
      { id: 'b', name: 'Product B', price: 30, quantity: 1 },
    ])
  );

  renderCartPage();

  expect(screen.getByText(/are you ready to purchase these/i)).toBeInTheDocument();
  expect(screen.getByText(/product a/i)).toBeInTheDocument();
  expect(screen.getByText(/product b/i)).toBeInTheDocument();
  // total: (10 * 2) + (30 * 1) = 50
  expect(screen.getByText(/total: 50 usd/i)).toBeInTheDocument();
});

test('removing the only item shows the empty state message', () => {
  localStorage.setItem(
    'cart',
    JSON.stringify([{ id: 'a', name: 'Product A', price: 10, quantity: 1 }])
  );

  renderCartPage();

  expect(screen.getByText(/product a/i)).toBeInTheDocument();

  act(() => {
    userEvent.click(screen.getByRole('button', { name: /remove/i }));
  });

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
