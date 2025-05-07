import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import styles from '../styles/ProductSection.module.scss';

const ProductSection = ({ title, products, slug }) => {
  const [visibleProducts, setVisibleProducts] = useState(4);
  
  // Función para verificar si hay una URL de imagen válida
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-product.jpg';
    
    const urls = imageUrl.split(',');
    return urls[0]?.trim() || '/placeholder-product.jpg';
  };

  return (
    <section className={styles.productSection}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        <Link to={`/${slug}`} className={styles.viewAllLink}>Ver todos</Link>
      </div>
      <div className={styles.productList}>
        {products.slice(0, visibleProducts).map(product => (
          <Product
            key={product.id}
            id={product.id}
            category={product.category}
            name={product.model}
            price={product.price}
            imageUrl={getValidImageUrl(product.URLimg)}
          />
        ))}
      </div>
      {products.length > visibleProducts && (
        <div className={styles.showMoreContainer}>
          <button 
            className={styles.showMoreButton}
            onClick={() => setVisibleProducts(prev => prev + 4)}
          >
            Mostrar más productos
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductSection;