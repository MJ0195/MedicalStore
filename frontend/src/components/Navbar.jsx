import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar no-print">
      <div className="container">
        <Link to={user && user.role !== 'admin' ? "/store" : "/"} className="nav-brand">
          <Activity size={28} />
          MedStore Pro
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={{ fontWeight: 600, color: 'var(--primary)', marginRight: '1rem' }}>
                  Admin Dashboard
                </Link>
              )}
              {user.role !== 'admin' && (
                <>
                  <Link to="/store" style={{ fontWeight: 600 }}>Store</Link>
                  <Link to="/cart" style={{ fontWeight: 600 }}>Cart</Link>
                  <Link to="/my-orders" style={{ fontWeight: 600, marginRight: '1rem' }}>My Orders</Link>
                  <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                    {user.firstName}
                  </span>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
