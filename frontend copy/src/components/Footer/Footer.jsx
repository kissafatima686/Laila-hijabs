import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_COLUMNS = {
  'Delivery & Returns': [
    { label: 'Free shipping for orders over £120', url: '/free-shipping' },
    { label: 'Shipping information', url: '/shipping-info' },
    { label: 'Delivery', url: '/delivery' },
    { label: 'Returns & Exchanges', url: '/returns-exchanges' },
  ],
  'Customer Care': [
    { label: 'Gift Card', url: '/gift-card' },
    { label: 'Size guide', url: '/size-guide' },
    { label: 'Care & Repair', url: '/care-repair' },
    { label: 'Frequently asked questions', url: '/faq' },
    { label: 'Contact us', url: '/contact-us' },
    { label: 'Privacy policy', url: '/privacy-policy' },
    { label: 'Terms & conditions', url: '/terms-conditions' },
  ],
  'About Us': [
    { label: 'Our Story', url: '/our-story' },
    { label: 'Loyalty', url: '/loyalty' },
    { label: 'Visit Us', url: '/visit-us' },
    { label: 'Careers', url: '/careers' },
    { label: 'Journal', url: '/journal' },
    { label: 'Affiliate Program', url: '/affiliate-program' },
    { label: 'Affiliate Login', url: '/affiliate/login' },
  ]
};

const Footer = () => {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  useEffect(() => {
    fetch(`${API}/api/admin/module/footer-links`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Group by group_name and filter only active / live items
          const grouped = {};
          data.forEach(item => {
            const isLive = !item.status || item.status === 'Live' || item.status === 'Active';
            if (isLive) {
              const group = item.group_name || 'Quick Links';
              if (!grouped[group]) grouped[group] = [];
              grouped[group].push({ label: item.label, url: item.url });
            }
          });
          setColumns(grouped);
        }
      })
      .catch(() => {});
  }, []);

  const deliveryLinks = columns['Delivery & Returns'] || [];
  const customerCareLinks = columns['Customer Care'] || [];
  const aboutUsLinks = columns['About Us'] || [];

  return (
    <footer className="main-footer">
      <div className="wrap">
        {/* Five Column Grid */}
        <div className="footer-grid">
          {/* Col 1: Delivery & Returns (hidden if disabled) */}
          {deliveryLinks.length > 0 && (
            <div className="footer-col">
              <h4>Delivery & Returns</h4>
              <ul>
                {deliveryLinks.map((l, i) => (
                  <li key={i}><Link to={l.url}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 2: Customer Care (hidden if disabled) */}
          {customerCareLinks.length > 0 && (
            <div className="footer-col">
              <h4>Customer Care</h4>
              <ul>
                {customerCareLinks.map((l, i) => (
                  <li key={i}><Link to={l.url} className="footer-link">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3: Get In Touch */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <p>Message us on WhatsApp</p>
            <p><a href="https://wa.me/923238399480" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>+92 323 8399480</a></p>
            <p>Email us:<br/><a href="mailto:info@lailahijabs.com" style={{ textDecoration: 'none', color: 'inherit' }}>info@lailahijabs.com</a></p>
          </div>

          {/* Col 4: About Us (hidden if disabled) */}
          {aboutUsLinks.length > 0 && (
            <div className="footer-col">
              <h4>About Us</h4>
              <ul>
                {aboutUsLinks.map((l, i) => (
                  <li key={i}><Link to={l.url} className="footer-link">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 5: Join Our Community */}
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