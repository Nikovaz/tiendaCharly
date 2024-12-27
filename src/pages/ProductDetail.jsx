import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../styles/ProductDetail.module.scss';

const ProductDetail = () => {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(collection(db, category), id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          setError("No such document!");
        }
      } catch (error) {
        setError("Error fetching product: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, category]);

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const images = product.URLimg.split(',').map(url => url.trim());

  return (
    <div className={styles.productDetail}>
      <div className={styles.carousel}>
        {images.map((url, index) => (
          <img key={index} src={url} alt={product.model} className={styles.image} />
        ))}
      </div>
      <h2 className={styles.title}>{product.model}</h2>
      <p className={styles.price}>Precio: ${product.price}</p>
      <p className={styles.description}>{product.description}</p>
      <div className={styles.options}>
        <div className={styles.option}>
          <label htmlFor="color">Color:</label>
          <select id="color">
            {product.colors.split(',').map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className={styles.option}>
          <label htmlFor="size">Talla:</label>
          <select id="size">
            {product.sizes.split(',').map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <p className={styles.stock}>Stock: {product.stock}</p>
    </div>
  );
};

export default ProductDetail;