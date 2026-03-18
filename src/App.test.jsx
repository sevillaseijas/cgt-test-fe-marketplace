import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders home page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/welcome to our shop/i)).toBeInTheDocument();
});

test('renders product page for a given product id', () => {
  render(
    <MemoryRouter initialEntries={['/products/a']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/product a/i)).toBeInTheDocument();
});

test('renders cart page', () => {
  render(
    <MemoryRouter initialEntries={['/cart']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/ready to purchase/i)).toBeInTheDocument();
});
