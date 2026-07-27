import React from 'react';
import './HowWeDoIt.css';
import '../Footer/FooterPage.css';
import { FaCut, FaUserTie, FaTools, FaStore, FaDesktop } from 'react-icons/fa';

const HowWeDoIt = () => {
  const items = [
    { icon: <FaCut />, text: "DIRECT TO CONSUMER" },
    { icon: <FaUserTie />, text: "DESIGNED IN HOUSE" },
    { icon: <FaTools />, text: "NO MASS PRODUCTION" },
    { icon: <FaStore />, text: "SUPPORTING SMALL FACTORIES" },
    { icon: <FaDesktop />, text: "ONLINE & CONCESSIONS" },
  ];

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>HOW WE DO IT</h1>
        <div className="how-we-do-it-container">
          <div className="features-grid">
        {items.map((item, index) => (
          <div key={index} className="feature-item">
            <div className="icon">{item.icon}</div>
            <p>{item.text}</p>
          </div>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeDoIt;