import React, { useState } from 'react';
import './ContactUs.css';
import './FooterPage.css';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="footer-page-wrapper">
      <div className="contact-wrapper">
        {/* Left Sidebar */}
        <div className="contact-sidebar">
          <h2>Contact Us</h2>
          <div className="info-item">
            <FaWhatsapp className="info-icon" /> 
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>Contact via WhatsApp:</p>
              <p>+92 323 8399480</p>
            </div>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" /> 
            <div>
              <p>info@lailahijabs.com</p>
            </div>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" /> 
            <div>
              <p style={{ marginBottom: '12px' }}><strong>Pakistan Office:</strong><br/>Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad</p>
              <p><strong>UAE Office:</strong><br/>Business Village Block-B, 3rd Floor, Office 301, Dubai, UAE</p>
            </div>
          </div>
          <h3 style={{ marginTop: '40px', marginBottom: '15px' }}>Follow Us</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/thelailahijab/?rdid=bXKFISlW0hph3zh4" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'inherit' }}><FaFacebookF /></a>
            <a href="https://www.instagram.com/the_lailahijabs/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'inherit' }}><FaInstagram /></a>
            <a href="https://www.tiktok.com/@the_lailahijabs?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'inherit' }}><FaTiktok /></a>
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form">
          <h2>Contact Me</h2>
          {submitted ? (
            <div className="success-message" style={{ background: '#3E4930', color: '#ffffff', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '8px', fontFamily: 'Fraunces, serif' }}>Message Sent!</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Thank you for reaching out. We have received your query and our team will get in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input type="text" placeholder="First Name *" required />
                <input type="text" placeholder="Last Name *" required />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number *" required />
                <input type="email" placeholder="Email *" required />
              </div>
              <textarea placeholder="Write Your Message *" rows="5" required></textarea>
              <button type="submit" className="submit-btn">Submit Now</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;