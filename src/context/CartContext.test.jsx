import { cartReducer } from './CartContext';

const productA = { id: 'a', name: 'Product A', price: 10 };
const productB = { id: 'b', name: 'Product B', price: 30 };

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
});
