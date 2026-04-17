import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Printer, CheckCircle, ArrowLeft } from 'lucide-react';

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order', error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading Invoice...</div>;
  if (!order) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Order not found</div>;

  return (
    <div className="container" style={{ padding: '2rem 20px', maxWidth: '800px' }}>
      
      {/* Non-printable header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/store" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back to Store
        </Link>
        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Print Bill
        </button>
      </div>

      {/* Invoice Card */}
      <div className="card stat-card" style={{ padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--border)', paddingBottom: '2rem' }}>
          <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
          <p style={{ color: '#64748b' }}>Thank you for your purchase.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Billed To:</h3>
            <p style={{ margin: '0 0 5px' }}><strong>{order.user.firstName} {order.user.lastName}</strong></p>
            <p style={{ margin: '0', color: '#64748b' }}>{order.user.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Invoice Details:</h3>
            <p style={{ margin: '0 0 5px' }}><strong>Order ID:</strong> #{order._id.substring(0, 8).toUpperCase()}</p>
            <p style={{ margin: '0 0 5px' }}><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p style={{ margin: '0', color: '#64748b' }}><strong>Payment:</strong> {order.paymentMethod}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-color)' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>Item Description</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.medicines.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '15px 12px', borderBottom: '1px solid var(--border)' }}>
                  <strong>{item.medicine ? item.medicine.name : 'Unknown Item'}</strong>
                  {item.medicine && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Batch: {item.medicine.batchNo}</div>}
                </td>
                <td style={{ padding: '15px 12px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '15px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ padding: '15px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              <span>Total Amount</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontSize: '0.9rem' }}>
          <p>This is a computer generated invoice and requires no physical signature.</p>
          <p>MedStore Pro Management System</p>
        </div>
      </div>

      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .card, .card * { visibility: visible; }
            .card { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
            .no-print { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

export default InvoicePage;
