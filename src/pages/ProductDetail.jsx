import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useCart } from '../context/CartProvider';
import styles from '../styles/ProductDetail.module.scss';

const ProductDetail = () => {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          // Convertir URLimg, colors y sizes en arrays con verificación de datos
          if (productData.URLimg) {
            if (typeof productData.URLimg === 'string') {
              productData.URLimg = productData.URLimg.split(',').map((url) => url.trim());
            } else if (!Array.isArray(productData.URLimg)) {
              productData.URLimg = [productData.URLimg]; // Convierte a array si no es string ni array
            }
          } else {
            productData.URLimg = ['/placeholder-product.jpg']; // Imagen predeterminada si no existe
          }

          if (productData.colors) {
            if (typeof productData.colors === 'string') {
              productData.colors = productData.colors.split(',').map((color) => color.trim());
            } else if (!Array.isArray(productData.colors)) {
              productData.colors = [String(productData.colors)];
            }
          } else {
            productData.colors = ['Único']; // Color predeterminado si no existe
          }

          if (productData.sizes) {
            if (typeof productData.sizes === 'string') {
              productData.sizes = productData.sizes.split(',').map((size) => size.trim());
            } else if (!Array.isArray(productData.sizes)) {
              productData.sizes = [String(productData.sizes)];
            }
          } else {
            productData.sizes = ['Único']; // Tamaño predeterminado si no existe
          }

          setProduct(productData);
          setSelectedColor(productData.colors[0]);
          setSelectedSize(productData.sizes[0]);
        } else {
          setError('El producto no existe.');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        setError('Error al obtener el producto. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, category]);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.URLimg.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.URLimg.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);

    // Actualiza el índice de la imagen según el color seleccionado
    const colorIndex = product.colors.indexOf(color);
    if (colorIndex !== -1) {
      setCurrentImageIndex(colorIndex);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const item = {
      id: product.id,
      title: product.title || 'Producto',
      price: product.price || 0,
      selectedColor,
      selectedSize,
      URLimg: product.URLimg[currentImageIndex] || '/placeholder-product.jpg',
      quantity: 1,
    };
    addItemToCart(item);
    
    // Notificación visual
    const notification = document.createElement('div');
    notification.textContent = '¡Producto agregado al carrito!';
    notification.className = styles.notification;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add(styles.show);
      
      setTimeout(() => {
        notification.classList.remove(styles.show);
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }, 10);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>No se encontró el producto</div>;

  return (
    <div className={styles.productDetail}>
      {product.URLimg && product.URLimg.length > 0 && (
        <div className={styles.carousel}>
          {product.URLimg.length > 1 && (
            <button className={`${styles.carouselButton} ${styles.prev}`} onClick={handlePrev}>
              &#8249;
            </button>
          )}
          <div
            className={styles.carouselSlides}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {product.URLimg.map((img, index) => (
              <div key={index} className={styles.carouselSlide}>
                <img 
                  src={img} 
                  alt={`${product.title || 'Producto'} - ${index}`} 
                  onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                />
              </div>
            ))}
          </div>
          {product.URLimg.length > 1 && (
            <button className={`${styles.carouselButton} ${styles.next}`} onClick={handleNext}>
              &#8250;
            </button>
          )}
          {product.URLimg.length > 1 && (
            <ul className={styles.carouselThumbnails}>
              {product.URLimg.map((img, index) => (
                <li
                  key={index}
                  className={index === currentImageIndex ? styles.selected : ''}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title || 'Producto'} - Thumbnail ${index}`} 
                    onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className={styles.productInfo}>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p className={styles.price}>Precio: ${product.price}</p>

        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className={styles.selectGroup}>
            <label htmlFor="color">Color:</label>
            <select
              id="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
            >
              {product.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        )}

        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <div className={styles.selectGroup}>
            <label htmlFor="size">Tamaño:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;