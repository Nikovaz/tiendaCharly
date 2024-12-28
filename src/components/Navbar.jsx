import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
  const { cartItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Tienda
      </Link>
      <div className={styles.navLinks}>
        <Link to="/boxer-lisos">Boxer Lisos</Link>
        <Link to="/boxer-estampados">Boxer Estampados</Link>
        <Link to="/boxer-deportivos">Boxer Deportivos</Link>
      </div>
      <div className={styles.cartIcon}>
        <Link to="/cart">
          <img src="/path/to/cart-icon.png" alt="Cart" />
          <span className={styles.cartCount}>{cartItems.length}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;