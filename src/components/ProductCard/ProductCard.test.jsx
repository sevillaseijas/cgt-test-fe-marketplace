import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import products from '../../data/products';
import ProductCard from './ProductCard';

const [firstProduct] = products;

function renderProductCard() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={firstProduct} />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('toast disappears after 2 seconds', () => {
  jest.useFakeTimers();
  renderProductCard();

  userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  expect(screen.getByText(/added to cart/i)).toBeInTheDocument();

  act(() => jest.advanceTimersByTime(2000));
  expect(screen.queryByText(/added to cart/i)).not.toBeInTheDocument();

  jest.useRealTimers();
});

test('shows Add to cart button when product is not in cart', () => {
  renderProductCard();
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  expect(screen.queryByText(/in cart/i)).not.toBeInTheDocument();
});

test('shows In cart controls after adding the product', () => {
  renderProductCard();

  userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

  expect(screen.getByText(/in cart/i)).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
});

test('clicking + in the in-cart controls increments the quantity', () => {
  renderProductCard();

  userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  userEvent.click(screen.getByRole('button', { name: new RegExp(`increase quantity of ${firstProduct.name}`, 'i') }));

  expect(screen.getByText('2')).toBeInTheDocument();
});

test('clicking − in the in-cart controls decrements the quantity', () => {
  localStorage.setItem('cart', JSON.stringify([{ ...firstProduct, quantity: 3 }]));
  renderProductCard();

  userEvent.click(screen.getByRole('button', { name: new RegExp(`decrease quantity of ${firstProduct.name}`, 'i') }));

  expect(screen.getByText('2')).toBeInTheDocument();
});

test('clicking − when quantity is 1 removes item and shows Add to cart again', () => {
  localStorage.setItem('cart', JSON.stringify([{ ...firstProduct, quantity: 1 }]));
  renderProductCard();

  expect(screen.getByText(/in cart/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: new RegExp(`decrease quantity of ${firstProduct.name}`, 'i') }));

  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  expect(screen.queryByText(/in cart/i)).not.toBeInTheDocument();
});
