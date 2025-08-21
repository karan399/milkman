import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TraditionalPage from './components/TraditionalPage';
import DairyPage from './components/DairyPage';
import GiftBoxPage from './components/GiftBoxPage';
import GiftBoxBuilder from './components/GiftBoxBuilder';
import MenuPage from './components/MenuPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [showFeaturedProducts, setShowFeaturedProducts] = useState(true);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <div className="min-h-screen bg-gray-50">
                <Header onShowAllProducts={setShowFeaturedProducts} />
                <Hero onShowAllProducts={setShowFeaturedProducts} />
                <Categories onShowAllProducts={setShowFeaturedProducts} />
                {showFeaturedProducts && <FeaturedProducts />}
                <About />
                <Contact />
                <Footer />
              </div>
            } />
            
            {/* Category Pages */}
            <Route path="/traditional" element={<TraditionalPage />} />
            <Route path="/dairy" element={<DairyPage />} />
            {/* Premium page removed */}
            <Route path="/gift-box" element={<GiftBoxPage />} />
            <Route path="/gift-box-builder" element={<GiftBoxBuilder />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;