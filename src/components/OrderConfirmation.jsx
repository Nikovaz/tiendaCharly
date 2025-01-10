import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../styles/OrderConfirmation.module.scss';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = location.state?.order?.id;
      if (!orderId) {
        setError('No se encontró la orden.');
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder(orderSnap.data());
        } else {
          setError('No se encontró la orden.');
        }
      } catch (err) {
        setError('Error al obtener la orden.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state?.order?.id]);

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.orderConfirmation}>
      <div className={styles.confirmationIcon}>
        <FaCheckCircle />
      </div>
      <h1>Confirmación de Orden</h1>
      <div className={styles.orderDetails}>
        <h2>Detalles de la Orden</h2>
        <p><strong>ID de la Orden:</strong> {location.state?.order?.id}</p>
        <p><strong>Nombre:</strong> {order.customerName} {order.customerLastName}</p>
        <p><strong>Teléfono:</strong> {order.customerPhone}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Comentarios:</strong> {order.comment}</p>
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