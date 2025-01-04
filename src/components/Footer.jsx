import React from 'react';
import styles from '../styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.socialMedia}>
          <a className={styles.socialLink} href="#!" role="button">
            <img src="/facebook.png" alt="Facebook" className={styles.icon} />
          </a>
          
          <a className={styles.socialLink} href="https://www.instagram.com/charl.tienda/" role="button">
          <img src="/instagram.png" alt="Instagram" className={styles.icon} />

          </a>
          <a className={styles.socialLink} href="#!" role="button">
          <img src="/whatsapp.png" alt="Whatsapp" className={styles.icon} />
          </a>
        </section>
      </div>
      <div className={styles.copyright}>
        © 2020 Copyright:
        <a className={styles.link} href="https://mdbootstrap.com/">MDBootstrap.com</a>
      </div>
    </footer>
  );
};

export default Footer;