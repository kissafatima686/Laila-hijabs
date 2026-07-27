// src/components/Footer/AboutUs/Loyalty.jsx
import React from 'react';
import '../FooterPage.css';

const Loyalty = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>Loyalty Program</h1>
        <p>Join our loyalty program to earn points on every purchase and enjoy exclusive rewards.</p>
        <div className="loyalty-benefits">
          <h2>HOW IT WORKS</h2>
          <ul>
            <li>Earn points for every £1 spent.</li>
            <li>Redeem points for discounts on future orders.</li>
            <li>Get early access to sales and new collections.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;