import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import BoxerLisos from './pages/BoxerLisos';
import BoxerEstampados from './pages/BoxerEstampados';
import BoxerDeportivos from './pages/BoxerDeportivos';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import Footer from './components/Footer';
import { CartProvider } from './context/CartProvider';
import './global/App.scss';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/boxer-lisos" element={<BoxerLisos />} />
              <Route path="/boxer-estampados" element={<BoxerEstampados />} />
              <Route path="/boxer-deportivos" element={<BoxerDeportivos />} />
              <Route path="/:category/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;