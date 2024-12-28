import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartItem.module.scss';
import { useCart } from '../context/CartProvider';

const CartItem = ({ item }) => {
  const { incrementItem, decrementItem, removeFromCart } = useCart();

  return (
    <div className={styles.cartItem}>
      <img src={item.URLimg} alt={item.title} />
      <div>
        <h4>{item.title}</h4>
        <p>Precio: ${item.price}</p>
        <p>Cantidad: {item.quantity}</p>
        <div className={styles.buttonGroup}>
          <button onClick={() => incrementItem(item.id)}>+</button>
          <button onClick={() => decrementItem(item.id)}>-</button>
          <button onClick={() => removeFromCart(item.id)}>x</button>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    URLimg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;