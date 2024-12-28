import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/OrderConfirmation.module.scss';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order || {};

  useEffect(() => {
    if (!location.state?.order) {
      // Handle case where order is not available in location state
    }
  }, [location]);

  return (
    <div className={styles.orderConfirmationContainer}>
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <div className={styles.orderSummary}>
        <h2>Order Details</h2>
        <ul>
          <li><strong>Order ID:</strong> {order.id}</li>
          <li><strong>Customer Name:</strong> {order.customerName}</li>
          <li><strong>Customer Email:</strong> {order.customerEmail}</li>
          <li><strong>Total:</strong> ${order.total?.toFixed(2)}</li>
          <li><strong>Date:</strong> {order.date ? new Date(order.date.seconds * 1000).toLocaleString() : 'N/A'}</li>
        </ul>
      </div>
      <div className={styles.cartSummary}>
        <h2>Items</h2>
        <ul>
          {order.items?.map((item, index) => (
            <li key={`${item.id}-${index}`} className={styles.item}>
              {item.title} - ${item.price} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderConfirmation;