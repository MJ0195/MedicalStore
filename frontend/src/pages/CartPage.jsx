import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, CreditCard, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/orders', {
        cartItems: cart,
        paymentMethod: 'Credit Card'
      });
      
      clearCart();
      // Redirect to invoice page
      navigate(`/invoice/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Looks like you haven't added any medicines to your cart yet.</p>
        <Link to="/store" className="btn btn-primary">Browse Medicines</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/store')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ color: 'var(--primary-dark)' }}>Your Cart</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>Medicine</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Qty</th>
                <th style={{ padding: '12px' }}>Total</th>
                <th style={{ padding: '12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.medicineId} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '15px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '15px' }}>₹{item.price.toFixed(2)}</td>
                  <td style={{ padding: '15px' }}>{item.quantity}</td>
                  <td style={{ padding: '15px', fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <button 
                      onClick={() => removeFromCart(item.medicineId)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <span style={{ color: '#64748b' }}>Total Items:</span>
            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            <span>Total Amount:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '12px' }}
          >
            <CreditCard size={20} />
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
