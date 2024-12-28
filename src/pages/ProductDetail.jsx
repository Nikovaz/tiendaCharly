import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useCart } from '../context/CartProvider';
import Slider from "react-slick";
import styles from '../styles/ProductDetail.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with id: ${id} and category: ${category}`);
        if (!id || !category) {
          throw new Error("Missing id or category");
        }
        const docRef = doc(collection(db, category), id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          console.log('Product data:', productData);
          setProduct(productData);
          setSelectedColor(productData.colors.split(',')[0].trim()); // Seleccionar el primer color por defecto
          setSelectedSize(productData.sizes.split(',')[0].trim()); // Seleccionar el primer talle por defecto
          setSelectedImage(productData.URLimg.split(',')[0].trim()); // Seleccionar la primera imagen por defecto
        } else {
          console.log('No such document!');
          setError("El producto no existe.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error al obtener el producto: " + error.message);
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

  const images = product.URLimg ? product.URLimg.split(',').map(url => url.trim()) : [];
  const colors = product.colors ? product.colors.split(',').map(color => color.trim()) : [];
  const sizes = product.sizes ? product.sizes.split(',').map(size => size.trim()) : [];

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleImageClick = (url, color) => {
    setSelectedImage(url);
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    const item = {
      id: product.id,
      title: product.title,
      price: product.price,
      selectedColor,
      selectedSize,
      URLimg: images,
      quantity: 1,
    };
    addItemToCart(item);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <div className={styles.nextArrow}>→</div>,
    prevArrow: <div className={styles.prevArrow}>←</div>,
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.selectedImageContainer}>
        <img src={selectedImage} alt={product.model} className={styles.selectedImage} />
      </div>
      <Slider {...settings} className={styles.carousel}>
        {images.map((url, index) => (
          <div key={index} className={styles.imageContainer}>
            <img
              src={url}
              alt={product.model}
              className={`${styles.image} ${selectedImage === url ? styles.selected : ''}`}
              onClick={() => handleImageClick(url, colors[index])}
            />
          </div>
        ))}
      </Slider>
      <div>
        <h2 className={styles.title}>{product.model}</h2>
        <p className={styles.price}>Precio: ${product.price}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.options}>
          <div className={styles.option}>
            <label htmlFor="color">Color:</label>
            <select id="color" value={selectedColor} onChange={handleColorChange}>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className={styles.option}>
            <label htmlFor="size">Talla:</label>
            <select id="size" value={selectedSize} onChange={handleSizeChange}>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
        <p className={styles.stock}>Stock: {product.stock}</p>
        <button onClick={handleAddToCart} className={styles.addToCartButton}>Agregar al Carrito</button>
      </div>
    </div>
  );
};

export default ProductDetail;