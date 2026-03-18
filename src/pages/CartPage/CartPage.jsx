import { useCart } from '../../context/CartContext';

function CartPage() {
  const { items, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <p>Are you ready to purchase these?</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — {item.price} USD x {item.quantity} = {item.price * item.quantity} USD
            <button onClick={() => removeFromCart(item)}>Remove</button>
          </li>
        ))}
      </ul>
      <p><strong>Total: {cartTotal} USD</strong></p>
    </div>
  );
}

export default CartPage;
