import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Product.module.scss';

const Product = ({ id, category, name, price, imageUrl, description }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);
  
  // Usar placeholder por defecto si no hay URL de imagen
  const placeholderImage = '/placeholder-product.jpg';
  const displayImageUrl = imageUrl || placeholderImage;
  
  // Precarga de imagen para mejor UX
  useEffect(() => {
    const img = new Image();
    img.src = displayImageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error("Error loading image:", displayImageUrl);
      setImageError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [displayImageUrl]);
  
  return (
    <Link 
      to={`/${category}/${id}`} 
      className={styles.productLink}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${styles.product} ${isHovered ? styles.hovered : ''}`}>
        <div className={styles.imageContainer}>
          {!imageLoaded && !imageError && (
            <div className={styles.imagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
          
          <img 
            ref={imageRef}
            src={imageError ? placeholderImage : displayImageUrl} 
            alt={name || 'Producto'} 
            className={`${styles.productImage} ${imageLoaded ? styles.loaded : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {isHovered && (
            <div className={styles.quickView}>
              <span>Vista rápida</span>
            </div>
          )}
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>{name || 'Producto'}</h3>
          <p className={styles.productPrice}>
            <span className={styles.priceLabel}>Precio:</span>
            <span className={styles.priceValue}>${price || 0}</span>
          </p>
          {description && description.length > 0 && (
            <p className={styles.productDescription}>
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;