import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Header.css';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          90s shop
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            Shop
          </Link>
          <Link to="/cart" className="header__cart">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="header__cart-badge">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
