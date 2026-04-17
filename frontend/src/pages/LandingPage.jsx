import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, BellRing, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Precision in Pharmacy Management</h1>
          <p>
            Streamline your medical store operations with our advanced inventory management system. 
            Track stock, manage alerts, and analyze performance in real-time.
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            Get Started Now
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="text-center" style={{ color: 'var(--primary-dark)', fontSize: '2.5rem' }}>Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <PackageSearch size={32} />
              </div>
              <h3>Stock Tracking</h3>
              <p>Monitor your inventory levels with precision. Automatically update quantities with every transaction.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BellRing size={32} />
              </div>
              <h3>Real-time Alerts</h3>
              <p>Get instant notifications for low stock and expiring medicines to maintain optimal inventory.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Detailed Analytics</h3>
              <p>Visualize sales trends, identify best-selling products, and make data-driven decisions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
