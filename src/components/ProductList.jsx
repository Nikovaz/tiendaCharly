import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ProductSection from '../sections/ProductSection';
import styles from '../styles/ProductList.module.scss';

const ProductList = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const estampadosSnapshot = await getDocs(collection(db, 'boxer_estampados'));
        const lisosSnapshot = await getDocs(collection(db, 'boxer_lisos'));
        const deportivosSnapshot = await getDocs(collection(db, 'boxer_deportivo'));

        const estampados = estampadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), category: 'boxer_estampados' }));
        const lisos = lisosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), category: 'boxer_lisos' }));
        const deportivos = deportivosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), category: 'boxer_deportivo' }));

        const sectionsArray = [
          { title: 'Boxer Estampados', products: estampados, slug: 'boxer-estampados' },
          { title: 'Boxer Lisos', products: lisos, slug: 'boxer-lisos' },
          { title: 'Boxer Deportivos', products: deportivos, slug: 'boxer-deportivos' }
        ];

        setSections(sectionsArray);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.productListContainer}>
      {sections.map(section => (
        <ProductSection 
          key={section.title} 
          title={section.title} 
          products={section.products} 
          slug={section.slug}
        />
      ))}
    </div>
  );
};

export default ProductList;