// src/components/Footer/PrivacyPolicy.jsx
import React from 'react';
import './FooterPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. This privacy statement provides information about the personal information that Aab UK collects, and the ways in which we use that personal information.</p>

      <h2>Personal Information Collection</h2>
      <p>Aab UK may collect and use the following kinds of personal information:</p>
      <ul>
        <li>Information about your use of this website</li>
        <li>Information that you provide for the purpose of registering with the website</li>
        <li>Information about transactions carried out over this website</li>
        <li>Information that you provide for the purpose of subscribing to the website services</li>
        <li>Any other information that you send to us</li>
      </ul>

      <h2>Using Personal Information</h2>
      <p>Aab UK may use your personal information to:</p>
      <ul>
        <li>Administer this website</li>
        <li>Personalise the website for you</li>
        <li>Enable your access to and use of the website services</li>
        <li>Send to you products that you purchase</li>
        <li>Supply to you services that you purchase</li>
        <li>Send you statements and invoices</li>
        <li>Collect payments from you</li>
        <li>Send you marketing communications</li>
      </ul>

      {/* Continue with the rest of your sections: Securing Data, Cross-Border Transfers, etc. */}
      
      <h2>Contact Us</h2>
      <p>You can either email us on admin@aabcollection.com or call + 44 (0) 203 823 7768.</p>
    </div>
    </div>
  );
};

export default PrivacyPolicy;