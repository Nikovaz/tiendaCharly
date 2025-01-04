import React, { useState } from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import styles from '../styles/Checkout.module.scss';

const Checkout = () => {
  const { cartItems, removeItemFromCart, calculateTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeItemFromCart(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cartItems.length) {
      setError('El carrito está vacío');
      return;
    }

    if (customerEmail !== confirmEmail) {
      setError('Los emails no coinciden');
      return;
    }

    const order = {
      customerName,
      customerLastName,
      customerPhone,
      customerEmail,
      comment,
      items: cartItems,
      total: calculateTotal(),
      date: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), order);

      // Actualizar el stock de los productos
      for (const item of cartItems) {
        const q = query(collection(db, 'products'), where('id', '==', item.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((productDoc) => {
          const productRef = doc(db, 'products', productDoc.id);
          updateDoc(productRef, { stock: productDoc.data().stock - item.quantity });
        });
      }

      console.log('Orden generada con ID:', docRef.id);
      clearCart();
      navigate('/order-confirmation', { state: { order: { ...order, id: docRef.id } } });
    } catch (error) {
      console.error('Error al generar la orden:', error);
      setError('Error al generar la orden');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.orderSummary}>
        <h2>Resumen de la Orden</h2>
        {cartItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}-${item.selectedColor}-${item.selectedSize}`} 
            className={styles.cartItem}
          >
            <div className={styles.itemDetails}>
              <img 
                src={Array.isArray(item.URLimg) ? item.URLimg[0] : item.URLimg} 
                alt={item.title} 
                className={styles.itemImage}
                onError={(e) => {
                  console.error('Error cargando imagen:', e);
                  e.target.src = '/imagen-por-defecto.jpg';
                }}
              />
              <div className={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p>Color: {item.selectedColor}</p>
                <p>Talle: {item.selectedSize}</p>
                <p>Precio: ${item.price}</p>
                <p>Cantidad: {item.quantity}</p>
              </div>
              <button 
                onClick={() => handleRemove(item.id)}
                className={styles.removeButton}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <div className={styles.total}>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.checkoutForm}>
        <h2>Información de Contacto</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Teléfono:</label>
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
          <label htmlFor="confirmEmail">Confirmar Email:</label>
          <input
            type="email"
            id="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comment">Comentarios (máx. 100 caracteres):</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength="100"
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!cartItems.length}
        >
          Confirmar Orden
        </button>
      </form>
    </div>
  );
};

export default Checkout;