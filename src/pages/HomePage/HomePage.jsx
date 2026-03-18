import { Link } from 'react-router-dom';
import products from '../../data/products';

function HomePage() {
  return (
    <div>
      <p>Welcome to our shop!</p>
      <p>
        You are probably interested in{' '}
        <Link to={`/products/${products[0].id}`}>{products[0].name}</Link>.
      </p>
      <p>
        Check out the newest product{' '}
        <Link to={`/products/${products[1].id}`}>{products[1].name}</Link>!
      </p>
    </div>
  );
}

export default HomePage;
