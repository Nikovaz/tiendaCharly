import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProductList from './components/ProductList';
import BoxerLisos from './pages/BoxerLisos';
import BoxerEstampados from './pages/BoxerEstampados';
import Medias from './pages/Medias';
import ProductDetail from './pages/ProductDetail';
import './global/App.scss';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/boxer-lisos" element={<BoxerLisos />} />
          <Route path="/boxer-estampados" element={<BoxerEstampados />} />
          <Route path="/medias" element={<Medias />} />
          <Route path="/:category/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;