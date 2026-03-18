import { Link } from 'react-router-dom';

function Header({ cartCount = 0 }) {
  return (
    <header>
      90s shop
      <nav>
        <ul style={{ listStyleType: 'none', display: 'flex' }}>
          <li><Link to="/">Home</Link></li>
          |
          <li><Link to="/cart">Cart ({cartCount})</Link></li>
        </ul>
      </nav>
      <hr />
    </header>
  );
}

export default Header;
