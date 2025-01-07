import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Product from '../components/Product';
import styles from '../styles/ProductSection.module.scss';

const BoxerEstampados = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'boxer_estampados'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.productList}>
      {products.map(product => (
        <Product
          key={product.id}
          id={product.id}
          category="boxer_estampados"
          name={product.model}
          price={product.price}
          description={product.description}
          colors={product.colors}
          sizes={product.sizes}
          stock={product.stock}
          imageUrl={product.URLimg.split(',')[0].trim()} // Usar la primera imagen de la lista
        />
      ))}
    </div>
  );
};

export default BoxerEstampados;