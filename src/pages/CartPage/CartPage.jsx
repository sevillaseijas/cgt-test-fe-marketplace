import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { items, removeFromCart, incrementItem, decrementItem, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <div className="cart-page__empty-icon">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
          <p className="cart-page__empty-text">Your cart is empty.</p>
          <Link to="/" className="cart-page__empty-link">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1 className="cart-page__title">Your cart</h1>
        <p className="cart-page__subtitle">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      <ul className="cart-page__list">
        {items.map((item) => (
          <li key={item.id} className="cart-page__item">
            <img
              src={item.image}
              alt={item.name}
              className="cart-page__item-img"
            />
            <div>
              <p className="cart-page__item-name">{item.name}</p>
              <p className="cart-page__item-unit-price">{item.price} USD each</p>
            </div>

            <div className="cart-page__qty">
              <button
                className="cart-page__qty-btn"
                onClick={() => decrementItem(item)}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus size={13} strokeWidth={2} />
              </button>
              <span className="cart-page__qty-value">{item.quantity}</span>
              <button
                className="cart-page__qty-btn"
                onClick={() => incrementItem(item)}
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus size={13} strokeWidth={2} />
              </button>
            </div>

            <div className="cart-page__actions">
              <span className="cart-page__subtotal">
                {item.price * item.quantity} USD
              </span>
              <button
                className="cart-page__remove-btn"
                onClick={() => removeFromCart(item)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-page__footer">
        <span className="cart-page__total-label">Total</span>
        <span className="cart-page__total-value">{cartTotal} USD</span>
      </div>
    </div>
  );
}

export default CartPage;
