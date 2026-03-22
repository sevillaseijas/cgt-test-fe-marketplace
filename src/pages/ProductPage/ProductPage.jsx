import { useParams } from 'react-router-dom';
import products from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductPage.css';

function ProductPage() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p className="product-page__not-found">Product not found.</p>;
  }

  return (
    <div className="product-page">
      <ProductCard product={product} />
    </div>
  );
}

export default ProductPage;
