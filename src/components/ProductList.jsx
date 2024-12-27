import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ProductSection from '../sections/ProductSection';

const ProductList = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const estampadosSnapshot = await getDocs(collection(db, 'boxer_estampados'));
        const lisosSnapshot = await getDocs(collection(db, 'boxer_lisos'));

        const estampados = estampadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), category: 'boxer_estampados' }));
        const lisos = lisosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), category: 'boxer_lisos' }));

        const sectionsArray = [
          { title: 'Boxer Estampados', products: estampados },
          { title: 'Boxer Lisos', products: lisos }
        ];

        setSections(sectionsArray);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {sections.map(section => (
        <ProductSection key={section.title} title={section.title} products={section.products} />
      ))}
    </div>
  );
};

export default ProductList;