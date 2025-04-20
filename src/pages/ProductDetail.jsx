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
        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          // Convertir URLimg, colors y sizes en arrays
          if (typeof productData.URLimg === 'string') {
            productData.URLimg = productData.URLimg.split(',').map((url) => url.trim());
          }
          if (typeof productData.colors === 'string') {
            productData.colors = productData.colors.split(',').map((color) => color.trim());
          }
          if (typeof productData.sizes === 'string') {
            productData.sizes = productData.sizes.split(',').map((size) => size.trim());
          }

          console.log('Processed product data:', productData); // Verifica el contenido
          setProduct(productData);

          if (productData.colors?.length > 0) {
            setSelectedColor(productData.colors[0]);
          }

          if (productData.sizes?.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        } else {
          setError('El producto no existe.');
        }
      } catch (error) {
        setError('Error al obtener el producto: ' + error.message);
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
      title: product.title,
      price: product.price,
      selectedColor,
      selectedSize,
      URLimg: product.URLimg[currentImageIndex],
      quantity: 1,
    };
    addItemToCart(item);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>No se encontró el producto</div>;

  return (
    <div className={styles.productDetail}>
      {product.URLimg && (
        <div className={styles.carousel}>
          <button className={`${styles.carouselButton} ${styles.prev}`} onClick={handlePrev}>
            &#8249;
          </button>
          <div
            className={styles.carouselSlides}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {product.URLimg.map((img, index) => (
              <div key={index} className={styles.carouselSlide}>
                <img src={img} alt={`${product.title} - ${index}`} />
              </div>
            ))}
          </div>
          <button className={`${styles.carouselButton} ${styles.next}`} onClick={handleNext}>
            &#8250;
          </button>
          <ul className={styles.carouselThumbnails}>
            {product.URLimg.map((img, index) => (
              <li
                key={index}
                className={index === currentImageIndex ? styles.selected : ''}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={img} alt={`${product.title} - Thumbnail ${index}`} />
              </li>
            ))}
          </ul>
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