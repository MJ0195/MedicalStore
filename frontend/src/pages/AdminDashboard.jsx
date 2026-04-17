import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, AlertTriangle, TrendingUp, PackageSearch, CalendarOff, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'users'
  
  // Inventory State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchBatch, setSearchBatch] = useState('');
  const [searchNearExpiry, setSearchNearExpiry] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Users State
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchUsersData();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/dashboard');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/users');
      setUsersData(data);
    } catch (error) {
      console.error('Error fetching users data', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/medicines/search', {
        params: {
          batchNo: searchBatch,
          nearExpiry: searchNearExpiry
        }
      });
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching medicines', error);
    }
  };

  // Only allow admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 style={{ color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)' }}>
        <button 
          className={`nav-tab-btn ${activeTab === 'inventory' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.1rem', fontWeight: 600,
            color: activeTab === 'inventory' ? 'var(--primary)' : '#64748b',
          }}
        >
          <PackageSearch size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
          Inventory Overview
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'users' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.1rem', fontWeight: 600,
            color: activeTab === 'users' ? 'var(--primary)' : '#64748b',
          }}
        >
          <Users size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
          Users & Orders
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          {/* Top Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '15px', background: 'rgba(10, 147, 150, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                <TrendingUp size={32} />
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Monthly Revenue</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  ₹{stats?.monthlyRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '15px', background: 'rgba(10, 147, 150, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                <PackageSearch size={32} />
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Total Sales Count</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {stats?.totalSalesCount}
                </p>
              </div>
            </div>

            <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--danger)' }}>
              <div style={{ padding: '15px', background: 'rgba(230, 57, 70, 0.1)', borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Low Stock Alerts</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {stats?.lowStockCount}
                </p>
              </div>
            </div>

            <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', color: '#f59e0b' }}>
                <CalendarOff size={32} />
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Expiring Soon</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {stats?.expiringCount}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            {/* Low Stock List */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                <AlertTriangle size={20} /> Low Stock Items
              </h3>
              {stats?.lowStockMedicines?.length === 0 ? (
                <p>No low stock alerts.</p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.lowStockMedicines.map(med => (
                    <li key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <span><strong style={{ color: 'var(--text-dark)' }}>{med.name}</strong> <span style={{ fontSize: '0.85rem', color: '#64748b' }}>(Batch: {med.batchNo})</span></span>
                      <span className="badge badge-danger">Stock: {med.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Expiring List */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                <CalendarOff size={20} /> Expiring Soon / Expired
              </h3>
              {stats?.expiringMedicines?.length === 0 ? (
                <p>No expiry alerts.</p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stats.expiringMedicines.map(med => {
                    const isExpired = new Date(med.expiryDate) < new Date();
                    return (
                      <li key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: isExpired ? '#ffebee' : '#fffbeb', borderRadius: '8px', border: '1px solid', borderColor: isExpired ? 'rgba(230,57,70,0.2)' : 'rgba(245,158,11,0.2)' }}>
                        <span><strong style={{ color: 'var(--text-dark)' }}>{med.name}</strong> <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>(Batch: {med.batchNo})</span></span>
                        <span className={`badge ${isExpired ? 'badge-danger' : 'badge-warning'}`}>
                          {new Date(med.expiryDate).toLocaleDateString()}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Search Medicines Section */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Search Inventory</h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Batch Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter batch number..."
                  value={searchBatch}
                  onChange={(e) => setSearchBatch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '10px' }}>
                <input 
                  type="checkbox" 
                  id="nearExpiry"
                  checked={searchNearExpiry}
                  onChange={(e) => setSearchNearExpiry(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="nearExpiry" style={{ fontWeight: 500, cursor: 'pointer' }}>Near Expiry Only</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} /> Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-color)' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Batch No</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Stock</th>
                      <th style={{ padding: '12px' }}>Price</th>
                      <th style={{ padding: '12px' }}>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(med => (
                      <tr key={med._id} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '15px', fontWeight: 500 }}>{med.name}</td>
                        <td style={{ padding: '15px' }}>{med.batchNo}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ background: 'rgba(0,128,128,0.1)', color: 'var(--primary-dark)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>{med.category}</span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          {med.stock <= 20 ? <span className="badge badge-danger">{med.stock}</span> : med.stock}
                        </td>
                        <td style={{ padding: '15px', fontWeight: 600 }}>₹{med.price.toFixed(2)}</td>
                        <td style={{ padding: '15px' }}>
                          {new Date(med.expiryDate) < new Date() ? 
                            <span className="badge badge-danger">{new Date(med.expiryDate).toLocaleDateString()}</span> : 
                            new Date(med.expiryDate).toLocaleDateString()
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>User Directory & Order History</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* User List */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Registered Users</h3>
              {usersData.length === 0 ? (
                <p>No regular users found.</p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {usersData.map(u => (
                    <li 
                      key={u._id} 
                      className={`user-list-item ${selectedUser?._id === u._id ? 'active-user' : ''}`}
                      onClick={() => setSelectedUser(u)}
                      style={{ 
                        padding: '15px', 
                        background: '#fff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '1px solid var(--border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <strong style={{ display: 'block' }}>{u.firstName} {u.lastName}</strong>
                      <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{u.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* User Details & Orders */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {selectedUser ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)' }}>{selectedUser.firstName} {selectedUser.lastName}</h3>
                      <p style={{ color: '#64748b' }}>{selectedUser.email}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 600 }}>Total Orders: {selectedUser.totalOrders}</p>
                      <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Total Spent: ₹{selectedUser.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '1rem' }}>Order History</h4>
                  {selectedUser.orders.length === 0 ? (
                    <p style={{ color: '#64748b' }}>This user has not placed any orders yet.</p>
                  ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {selectedUser.orders.map(order => (
                        <div key={order._id} style={{ background: 'white', padding: '12px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span style={{ fontWeight: 600 }}>₹{order.totalAmount.toFixed(2)} ({order.paymentMethod})</span>
                          </div>
                          <ul style={{ fontSize: '0.9rem' }}>
                            {order.medicines.map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.quantity}x {item.medicine ? item.medicine.name : 'Unknown Medicine'}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '3rem' }}>
                  <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                  <p>Select a user from the list to view their details and order history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
