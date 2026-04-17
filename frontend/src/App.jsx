import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import AdminDashboard from './pages/AdminDashboard';
import StoreFront from './pages/StoreFront';
import CartPage from './pages/CartPage';
import InvoicePage from './pages/InvoicePage';
import MyOrdersPage from './pages/MyOrdersPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/store" element={<StoreFront />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
