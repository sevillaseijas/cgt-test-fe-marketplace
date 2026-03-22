import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, cartReducer, useCart } from './CartContext';
import products from '../data/products';

// Local fixtures for reducer unit tests — decoupled from the catalog so
// reordering or renaming products.js entries never breaks these tests.
const productA = { id: 'fixture-a', name: 'Fixture A', price: 10 };
const productB = { id: 'fixture-b', name: 'Fixture B', price: 20 };

// Real first product from the catalog, used only for provider/localStorage tests.
const [firstCatalogProduct] = products.map(({ id, name, price }) => ({ id, name, price }));

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Pure reducer unit tests — no React, no DOM, instant feedback.
// ---------------------------------------------------------------------------
describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('adds a new item with quantity 1 when cart is empty', () => {
      const state = cartReducer([], { type: 'ADD_ITEM', payload: productA });
      expect(state).toHaveLength(1);
      expect(state[0]).toEqual({ ...productA, quantity: 1 });
    });

    it('increments quantity when item already exists in cart', () => {
      const initial = [{ ...productA, quantity: 1 }];
      const state = cartReducer(initial, { type: 'ADD_ITEM', payload: productA });
      expect(state).toHaveLength(1);
      expect(state[0].quantity).toBe(2);
    });

    it('adds a different item without affecting existing items', () => {
      const initial = [{ ...productA, quantity: 1 }];
      const state = cartReducer(initial, { type: 'ADD_ITEM', payload: productB });
      expect(state).toHaveLength(2);
      expect(state[1]).toEqual({ ...productB, quantity: 1 });
    });

    it('increments only the matching item and leaves other items unchanged', () => {
      const initial = [{ ...productA, quantity: 1 }, { ...productB, quantity: 2 }];
      const state = cartReducer(initial, { type: 'ADD_ITEM', payload: productA });
      expect(state[0].quantity).toBe(2);
      expect(state[1].quantity).toBe(2);
    });
  });

  describe('REMOVE_ITEM', () => {
    it('removes the item with the matching id', () => {
      const initial = [{ ...productA, quantity: 2 }, { ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'REMOVE_ITEM', payload: productA });
      expect(state).toHaveLength(1);
      expect(state[0].id).toBe(productB.id);
    });

    it('returns same state when item is not found', () => {
      const initial = [{ ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'REMOVE_ITEM', payload: productA });
      expect(state).toHaveLength(1);
    });
  });

  describe('INCREMENT_ITEM', () => {
    it('increments the quantity of the matching item by 1', () => {
      const initial = [{ ...productA, quantity: 2 }, { ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'INCREMENT_ITEM', payload: productA });
      expect(state[0].quantity).toBe(3);
      expect(state[1].quantity).toBe(1);
    });
  });

  describe('DECREMENT_ITEM', () => {
    it('decrements the quantity of the matching item by 1', () => {
      const initial = [{ ...productA, quantity: 3 }];
      const state = cartReducer(initial, { type: 'DECREMENT_ITEM', payload: productA });
      expect(state[0].quantity).toBe(2);
    });

    it('removes the item when quantity reaches 0', () => {
      const initial = [{ ...productA, quantity: 1 }];
      const state = cartReducer(initial, { type: 'DECREMENT_ITEM', payload: productA });
      expect(state).toHaveLength(0);
    });

    it('only decrements the target item and leaves others unchanged', () => {
      const initial = [{ ...productA, quantity: 2 }, { ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'DECREMENT_ITEM', payload: productA });
      expect(state[0].quantity).toBe(1);
      expect(state[1].quantity).toBe(1);
    });
  });

  describe('unknown action type', () => {
    it('returns the previous state unchanged to prevent accidental data loss', () => {
      const initial = [{ ...productA, quantity: 1 }];
      const state = cartReducer(initial, { type: 'UNKNOWN', payload: productA });
      expect(state).toEqual(initial);
    });
  });
});

// ---------------------------------------------------------------------------
// CartProvider integration tests — covers the useEffect/localStorage wiring
// that the reducer tests cannot reach.
// ---------------------------------------------------------------------------

function CartSummaryProbe() {
  const { cartTotal, items } = useCart();
  return (
    <div>
      <span data-testid="line-count">{items.length}</span>
      <span data-testid="cart-total">{cartTotal}</span>
    </div>
  );
}

function AddFirstProductButton() {
  const { addToCart } = useCart();
  return (
    <button type="button" onClick={() => addToCart(firstCatalogProduct)}>
      add first product
    </button>
  );
}

describe('CartProvider and localStorage', () => {
  it('hydrates cart from localStorage on mount so users keep their cart after a reload', () => {
    const expectedTotal = firstCatalogProduct.price * 3;
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...firstCatalogProduct, quantity: 3 }])
    );

    render(
      <CartProvider>
        <CartSummaryProbe />
      </CartProvider>
    );

    expect(screen.getByTestId('line-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent(String(expectedTotal));
  });

  it('persists cart to localStorage after an add action', () => {
    render(
      <CartProvider>
        <AddFirstProductButton />
      </CartProvider>
    );

    userEvent.click(screen.getByRole('button', { name: /add first product/i }));

    const stored = JSON.parse(localStorage.getItem('cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: firstCatalogProduct.id,
      quantity: 1,
      price: firstCatalogProduct.price,
    });
  });
});
