import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import CartPage from './CartPage';

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  );
}

test('shows empty message when cart has no items', () => {
  renderWithProviders(<CartPage />);
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
