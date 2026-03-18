import { useParams } from 'react-router-dom';
import products from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductPage() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return <ProductCard product={product} />;
}

export default ProductPage;
