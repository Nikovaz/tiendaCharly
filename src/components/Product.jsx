import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Product.module.scss';

const Product = ({ id, category, name, price, imageUrl }) => {
  return (
    <Link to={`/${category}/${id}`} className={styles.productLink}>
      <div className={styles.product}>
        <img src={imageUrl} alt={name} className={styles['product-image']} />
        <h2 className={styles['product-title']}>{name}</h2>
        <p className={styles['product-price']}>Precio: ${price}</p>
      </div>
    </Link>
  );
};

export default Product;