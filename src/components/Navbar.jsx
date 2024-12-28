import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-logo']}>
        <img src="/logoCharly.png" alt="Logo" />
      </div>
      <ul className={styles['navbar-links']}>
        <li><Link to="/boxer-lisos">Boxer Lisos</Link></li>
        <li><Link to="/boxer-estampados">Boxer Estampados</Link></li>
        <li><Link to="/boxer-deportivos">Boxer Deportivos</Link></li>
        <li><Link to="/medias">Medias</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;