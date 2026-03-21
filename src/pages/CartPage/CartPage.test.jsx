import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import products from '../../data/products';
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

test('renders all catalog products and correct total when all are added to cart', () => {
  // Add every product with quantity 1 so the test scales with the catalog.
  const cartItems = products.map(({ id, name, price }) => ({ id, name, price, quantity: 1 }));
  const expectedTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  localStorage.setItem('cart', JSON.stringify(cartItems));

  renderCartPage();

  expect(screen.getByText(/are you ready to purchase these/i)).toBeInTheDocument();

  products.forEach((product) => {
    expect(screen.getByText(new RegExp(product.name, 'i'))).toBeInTheDocument();
  });

  expect(
    screen.getByText(new RegExp(`total: ${expectedTotal} usd`, 'i'))
  ).toBeInTheDocument();
});

test('removing the only item shows the empty state message', () => {
  const [firstProduct] = products;
  localStorage.setItem('cart', JSON.stringify([{ ...firstProduct, quantity: 1 }]));

  renderCartPage();

  expect(screen.getByText(new RegExp(firstProduct.name, 'i'))).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /remove/i }));

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
