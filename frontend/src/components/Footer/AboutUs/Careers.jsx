// src/components/Footer/AboutUs/Careers.jsx
import React from 'react';
import '../FooterPage.css';

const Careers = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>Careers</h1>
        <p>Join our growing team and help us shape the future of modest fashion.</p>
        
        <h2>CURRENT OPENINGS</h2>
        <p>We are currently looking for passionate individuals in the following areas:</p>
        <ul>
          <li>Full-Stack Web Developer</li>
          <li>Customer Experience Specialist</li>
          <li>Fashion Merchandiser</li>
        </ul>
        <p>To apply, please email your CV and portfolio to careers@lailahijabs.com.</p>
      </div>
    </div>
  );
};

export default Careers;