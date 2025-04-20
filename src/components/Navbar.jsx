import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import Cart from './Cart';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
  const { cartItems } = useCart();
  const [isCartHovered, setIsCartHovered] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.topRow}>
        <Link to="/" className={styles.logo}>
          <img src="/logoCharly.png" alt="Logo Charly" /> {/* Usa la ruta relativa desde la carpeta public */}
        </Link>
        </div>
        <div className={styles.cartWrapper}>
          <div
            className={styles.cartIcon}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <img src="/cart.png" alt="Cart" />
            {cartItems.length > 0 && (
              <div className={styles.cartCount}>{cartItems.length}</div>
            )}
            {isCartHovered && (
              <div className={styles.cartContentWrapper}>
                <Cart className={styles.cartContent} />
              </div>
            )}
          
        </div>
      </div>
      <div className={styles.navLinks}>
        <Link to="/boxer-lisos">Boxer Lisos</Link>
        <Link to="/boxer-estampados">Boxer Estampados</Link>
        <Link to="/boxer-deportivos">Boxer Deportivos</Link>
      </div>
    </nav>
  );
};

export default Navbar;