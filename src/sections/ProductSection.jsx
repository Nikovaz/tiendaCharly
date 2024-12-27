import React from 'react';
import Product from '../components/Product';

const ProductSection = ({ title, products }) => {
  return (
    <section className="product-section">
      <h2>{title}</h2>
      <div className="product-list">
        {products.map(product => (
          <Product
            key={product.id}
            id={product.id}
            category={product.category}
            name={product.model}
            price={product.price}
            imageUrl={product.URLimg.split(',')[0].trim()} // Usar la primera imagen de la lista
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;