function ProductCard({ product, onAddToCart }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price} USD</p>
      <button onClick={() => onAddToCart(product)}>Add to cart</button>
      <div>
        <img src={product.image} width={640} alt={product.name} />
      </div>
    </div>
  );
}

export default ProductCard;
