import React, { useState } from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import styles from '../styles/Checkout.module.scss';

const Checkout = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (customerEmail !== confirmEmail) {
      setError('Emails do not match.');
      return;
    }

    const order = {
      customerName,
      customerLastName,
      customerPhone,
      customerEmail,
      comment,
      items: cartItems,
      total: getTotalPrice(),
      date: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), order);

      for (const item of cartItems) {
        const q = query(collection(db, 'products'), where('id', '==', item.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((productDoc) => {
          const productRef = doc(db, 'products', productDoc.id);
          updateDoc(productRef, { stock: productDoc.data().stock - item.quantity });
        });
      }

      console.log('Orden de pago generada con ID: ', docRef.id);
      clearCart();
      navigate('/order-confirmation', { state: { order: { ...order, id: docRef.id } } });
    } catch (error) {
      console.error('Error al generar la orden de pago: ', error);
      setError('Error generating order.');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Checkout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmEmail">Confirm Email:</label>
          <input
            type="email"
            id="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="comment">Comment (max 100 characters):</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="100"
          />
        </div>
        <div className={styles.formGroup}>
          <h2>Total: ${getTotalPrice().toFixed(2)}</h2>
        </div>
        <div className={styles.formGroup}>
          <button type="submit">Generate Order</button>
        </div>
      </form>

      <h2>Cart Items</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={`${item.id}-${index}`} className={styles.cartItem}>
            <div className={styles.itemDetails}>
              <img src={item.URLimg[0]} alt={item.title} className={styles.itemImage} />
              <span className={styles.itemText}>{item.title} - ${item.price} x {item.quantity}</span>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkout;