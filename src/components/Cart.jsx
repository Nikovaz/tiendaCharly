import React from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Cart.module.scss';

const Cart = () => {
  const { cartItems, incrementItem, decrementItem, removeItemFromCart, calculateTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemDetails}>
                <img src={item.URLimg[0]} alt={item.title} className={styles.itemImage} />
                <div className={styles.details}>
                  <h4>{item.title}</h4>
                  <p>Color: {item.selectedColor}</p>
                  <p>Size: {item.selectedSize}</p>
                  <p>Price: ${item.price}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => decrementItem(item.id, item.selectedColor, item.selectedSize)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementItem(item.id, item.selectedColor, item.selectedSize)}>+</button>
                  </div>
                  <button onClick={() => removeItemFromCart(item.id, item.selectedColor, item.selectedSize)} className={styles.deleteButton}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.cartTotal}>
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;