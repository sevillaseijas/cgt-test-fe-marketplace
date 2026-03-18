import { useParams } from 'react-router-dom';
import products from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductPage({ onAddToCart }) {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return <ProductCard product={product} onAddToCart={onAddToCart} />;
}

export default ProductPage;
