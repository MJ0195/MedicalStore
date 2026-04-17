import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PackageOpen, ExternalLink } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading Orders...</div>;

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 style={{ color: 'var(--primary-dark)', marginBottom: '2rem' }}>My Purchase History</h1>

      {orders.length === 0 ? (
        <div className="card stat-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <PackageOpen size={64} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>No orders found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>You haven't made any purchases yet.</p>
          <Link to="/store" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order._id} className="card stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-dark)' }}>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>₹{order.totalAmount.toFixed(2)}</p>
                  <Link to={`/invoice/${order._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 500, marginTop: '5px' }}>
                    View Invoice <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Purchased</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {order.medicines.map((item, idx) => (
                    <div key={idx} style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 600, margin: '0 0 5px' }}>{item.medicine ? item.medicine.name : 'Unknown'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
