import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, cartReducer, useCart } from './CartContext';

const productA = { id: 'a', name: 'Product A', price: 10 };
const productB = { id: 'b', name: 'Product B', price: 30 };

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
  });

  describe('REMOVE_ITEM', () => {
    it('removes the item with the matching id', () => {
      const initial = [{ ...productA, quantity: 2 }, { ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'REMOVE_ITEM', payload: productA });
      expect(state).toHaveLength(1);
      expect(state[0].id).toBe('b');
    });

    it('returns same state when item is not found', () => {
      const initial = [{ ...productB, quantity: 1 }];
      const state = cartReducer(initial, { type: 'REMOVE_ITEM', payload: productA });
      expect(state).toHaveLength(1);
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

function AddProductAButton() {
  const { addToCart } = useCart();
  return (
    <button type="button" onClick={() => addToCart(productA)}>
      add product a
    </button>
  );
}

describe('CartProvider and localStorage', () => {
  it('hydrates cart from localStorage on mount so users keep their cart after a reload', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...productA, quantity: 3 }])
    );

    render(
      <CartProvider>
        <CartSummaryProbe />
      </CartProvider>
    );

    expect(screen.getByTestId('line-count')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('30');
  });

  it('persists cart to localStorage after an add action', () => {
    render(
      <CartProvider>
        <AddProductAButton />
      </CartProvider>
    );

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /add product a/i }));
    });

    const stored = JSON.parse(localStorage.getItem('cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ id: 'a', quantity: 1, price: 10 });
  });
});
