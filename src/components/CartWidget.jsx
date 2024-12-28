import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import styles from '../styles/cartWidget.module.scss';

const CartWidget = () => {
  const { cartItems, incrementItem, decrementItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropbtn}>
        🛒 Carrito ({cartItems ? cartItems.length : 0})
      </button>
      <div className={styles.dropdownContent}>
        {cartItems && cartItems.length === 0 ? (
          <div>Tu carrito está vacío</div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <img src={item.URLimg[0]} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <p>Precio: ${item.price}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Color: {item.selectedColor}</p>
                  <p>Talla: {item.selectedSize}</p>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => incrementItem(item.id)}>+</button>
                    <button onClick={() => decrementItem(item.id)}>-</button>
                    <button onClick={() => removeFromCart(item.id)}>x</button>
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.totalAmount}>
              <h3>Total a Pagar: ${totalAmount}</h3>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutButton}>Pagar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartWidget;