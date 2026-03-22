import { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart, items, incrementItem, decrementItem } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card__info">
        <p className="product-card__eyebrow">Featured product</p>
        <h1 className="product-card__name">{product.name}</h1>
        <p className="product-card__price">{product.price} USD</p>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__divider" />

        {cartItem ? (
          <div className="product-card__in-cart">
            <span className="product-card__in-cart-label">In cart</span>
            <div className="product-card__qty-controls">
              <button
                className="product-card__qty-btn"
                onClick={() => decrementItem(product)}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus size={13} strokeWidth={2} />
              </button>
              <span className="product-card__qty-value">{cartItem.quantity}</span>
              <button
                className="product-card__qty-btn"
                onClick={() => incrementItem(product)}
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus size={13} strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <button className="product-card__btn" onClick={handleAdd}>
            <ShoppingBag size={15} strokeWidth={2} />
            Add to cart
          </button>
        )}
      </div>

      {added && (
        <div className="product-card__toast" role="status" aria-live="polite">
          Added to cart
        </div>
      )}
    </div>
  );
}

export default ProductCard;
