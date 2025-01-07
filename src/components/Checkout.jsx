import React, { useState } from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import styles from '../styles/Checkout.module.scss';

const Checkout = () => {
  const { cartItems, removeItemFromCart, calculateTotal, clearCart, incrementItem, decrementItem } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRemove = (id, selectedColor, selectedSize) => {
    removeItemFromCart(id, selectedColor, selectedSize);
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

    // Verificar que todos los campos tengan valores válidos
    if (!customerName || !customerLastName || !customerPhone || !customerEmail || !cartItems.length) {
      setError('Por favor, complete todos los campos requeridos.');
      return;
    }

    // Verificar que los elementos en cartItems no tengan valores undefined
    const validCartItems = cartItems.map(item => ({
      ...item,
      selectedColor: item.selectedColor || '',
      selectedSize: item.selectedSize || '',
      URLimg: item.URLimg || '',
      title: item.title || '',
      price: item.price || 0,
      quantity: item.quantity || 0,
    }));

    const order = {
      customerName,
      customerLastName,
      customerPhone,
      customerEmail,
      comment: comment || '', // Asegurarse de que el comentario no sea undefined
      items: validCartItems,
      total: calculateTotal(),
      date: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), order); // Asegurarse de que la colección se llame 'orders'

      // Actualizar el stock de los productos
      for (const item of validCartItems) {
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
    <div className={styles.centerWrapper}>
      <div className={styles.content}>
        <nav>
          <h1 className={styles.logo}>Cantidad de productos</h1>
          <div className={styles.icons}>
            <i className="fas fa-search"></i>
            <i className="fas fa-shopping-bag"></i><span style={{ marginLeft: '0.3rem' }}>{cartItems.length}</span>
          </div>
        </nav>
      
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${index}-${item.selectedColor}-${item.selectedSize}`} className={styles.bagProduct}>
            <div className={styles.image}>
              <img src={Array.isArray(item.URLimg) ? item.URLimg[0] : item.URLimg} alt={item.title} className={styles.productImage} onError={(e) => { e.target.src = '/imagen-por-defecto.jpg'; }} />
            </div>
            <div className={styles.description}>
              <p className={`${styles.productCode} ${styles.small} ${styles.muted}`}>Código del producto: {item.id}</p>
              <h1>{item.title}</h1>
              <p>{item.selectedColor}</p>
              <p className={styles.descriptionText}>Talle: {item.selectedSize}</p>
              <p style={{ marginBottom: '0.5rem' }}>Cantidad: {item.quantity}</p>
              <h2>${item.price}</h2>
              <div className={styles.quantityWrapper}>
                <button className={styles.btnRemove} onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}>Eliminar</button>
                <button onClick={() => incrementItem(item.id, item.selectedColor, item.selectedSize)}>+</button>
                <button onClick={() => decrementItem(item.id, item.selectedColor, item.selectedSize)}>-</button>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.bagTotal}>
          <div className={styles.subtotal}>
            <p className={styles.small}>Subtotal:</p>
            <p className={styles.small}>${calculateTotal().toFixed(2)}</p>
          </div>
          <div className={styles.total}>
            <h3>Total:</h3>
            <h3>${calculateTotal().toFixed(2)}</h3>
          </div>
        </div>
        <div className={styles.rightCol}>
          <h2>Información de Contacto</h2>
          <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default Checkout;