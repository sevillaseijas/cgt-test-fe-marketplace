function CartPage({ cartItems = [] }) {
  return (
    <div>
      <p>Are you ready to purchase these?</p>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CartPage;
