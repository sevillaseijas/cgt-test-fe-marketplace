import { Link } from 'react-router-dom';
import products from '../../data/products';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__eyebrow">New collection</p>
        <h1 className="home__title">Timeless pieces for the modern era.</h1>
      </section>

      <div className="product-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="product-grid__card"
          >
            <div className="product-grid__img-wrap">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-grid__info">
              <p className="product-grid__name">{product.name}</p>
              <p className="product-grid__price">{product.price} USD</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
