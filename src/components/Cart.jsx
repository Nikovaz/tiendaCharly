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
      <h2>Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}-${item.selectedColor}-${item.selectedSize}`} className={styles.cartItem}>
              <div className={styles.itemDetails}>
                <img 
                  src={Array.isArray(item.URLimg) ? item.URLimg[0] : item.URLimg} 
                  alt={item.title} 
                  className={styles.itemImage}
                  onError={(e) => {
                    e.target.src = '/imagen-por-defecto.jpg';
                  }}
                />
                <div className={styles.details}>
                  <h4>{item.title}</h4>
                  <p>Color: {item.selectedColor}</p>
                  <p>Talle: {item.selectedSize}</p>
                  <p>Precio: ${item.price}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => decrementItem(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementItem(item.id)}>+</button>
                  </div>
                  <button 
                    onClick={() => removeItemFromCart(item.id)} 
                    className={styles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.cartTotal}>
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
          <button 
            onClick={handleCheckout} 
            className={styles.checkoutButton}
          >
            Proceder al pago
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;