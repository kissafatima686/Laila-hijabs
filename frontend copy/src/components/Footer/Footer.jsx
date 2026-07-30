import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="wrap">
        {/* Brand Name 
        <Link to="/" className="footer-brand">
          Laila
          <span>HIJABS</span>
        </Link>*/}

        {/* Five Column Grid */}
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Delivery & Returns</h4>
            <ul>
             <li><Link to="/free-shipping">Free shipping for orders over £120</Link></li>
              <li><Link to="/shipping-info">Shipping information</Link></li>
              <li><Link to="/delivery">Delivery</Link></li>
              <li><Link to="/returns-exchanges">Returns & Exchanges</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul>
             <li><Link to="/gift-card" className="footer-link">Gift Card</Link></li>
              {/* CORRECTED: Wrapped in Link component */}
              <li><Link to="/size-guide" className="footer-link">Size guide</Link></li>
              <li><Link to="/care-repair" className="footer-link">Care & Repair</Link></li>
              <li><Link className="footer-link" to="/faq">Frequently asked questions</Link></li>
             <li><Link to="/contact-us" className="footer-link">Contact us</Link></li>
              <li><Link to="/privacy-policy" className="footer-link">Privacy policy</Link></li>
              <li><Link to="/terms-conditions" className="footer-link">Terms & conditions</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get In Touch</h4>
            <p>Message us on WhatsApp</p>
            <p><a href="https://wa.me/923238399480" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>+92 323 8399480</a></p>
            <p>Email us:<br/><a href="mailto:info@lailahijabs.com" style={{ textDecoration: 'none', color: 'inherit' }}>info@lailahijabs.com</a></p>
          </div>

          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/our-story" className="footer-link">Our Story</Link></li>
              <li><Link to="/loyalty" className="footer-link">Loyalty</Link></li>
              <li><Link to="/visit-us" className="footer-link">Visit Us</Link></li>
              <li><Link to="/careers" className="footer-link">Careers</Link></li>
              <li><Link to="/journal" className="footer-link">Journal</Link></li>
              <li><Link to="/affiliate-program" className="footer-link">Affiliates</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Join Our Community</h4>
            <p className="newsletter-text">Exclusive offers & sneak peeks are reserved for those on our mailing list, plus enjoy 10% OFF your first order.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="ENTER YOUR EMAIL *" required />
              <button type="submit">SIGN UP</button>
            </form>
            <h5 className="follow-title">FOLLOW US</h5>
            <div className="social-icons">
              <a href="https://www.facebook.com/thelailahijab/?rdid=bXKFISlW0hph3zh4" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://www.instagram.com/the_lailahijabs/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@the_lailahijabs?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
              <a href="https://wa.me/923238399480" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel"><FaWhatsapp /></a>
            </div>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="footer-copyright">
          © 2026 Laila Hijabs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;