import React, { useState } from 'react';
import { useContent } from '../../context/useContent';
import './ContactUs.css';
import './FooterPage.css';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { getSectionContent, loading } = useContent();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim() || 'Valued Customer';
    
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/module/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        email: email,
        phone: phone,
        message: message,
        subject: 'Contact Form Enquiry',
        status: 'New'
      })
    })
      .then(() => {
        setSubmitted(true);
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((err) => {
        console.error("Failed to submit message:", err);
        setSubmitted(true);
      });
  };

  const getVal = (key, defaultVal) => {
    return getSectionContent('contact_main_section', key, defaultVal);
  };

  return (
    <div className="footer-page-wrapper">
      <div className="contact-wrapper">
        {/* Left Sidebar */}
        <div className="contact-sidebar">
          <h2>{getVal('main_heading', 'Contact Us')}</h2>
          
          {getVal('whatsapp_number', '+92 323 8399480') && (
            <div className="info-item">
              <FaWhatsapp className="info-icon" /> 
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{getVal('whatsapp_label', 'Contact via WhatsApp:')}</p>
                <p>{getVal('whatsapp_number', '+92 323 8399480')}</p>
              </div>
            </div>
          )}
          
          {getVal('email_address', 'info@lailahijabs.com') && (
            <div className="info-item">
              <FaEnvelope className="info-icon" /> 
              <div>
                <p>{getVal('email_address', 'info@lailahijabs.com')}</p>
              </div>
            </div>
          )}
          
          {(getVal('pakistan_office') || getVal('uae_office') || true) && (
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" /> 
              <div>
                {getVal('pakistan_office', 'Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad') && (
                  <p style={{ marginBottom: '12px' }}>
                    <strong>Pakistan Office:</strong><br/>
                    {getVal('pakistan_office', 'Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad')}
                  </p>
                )}
                {getVal('uae_office', 'Business Village Block-B, 3rd Floor, Office 301, Dubai, UAE') && (
                  <p>
                    <strong>UAE Office:</strong><br/>
                    {getVal('uae_office', 'Business Village Block-B, 3rd Floor, Office 301, Dubai, UAE')}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <h3 style={{ marginTop: '40px', marginBottom: '15px' }}>{getVal('follow_us_heading', 'Follow Us')}</h3>
          <div className="social-links">
            {getVal('facebook_link', 'https://www.facebook.com/thelailahijab/') && (
              <a href={getVal('facebook_link')} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'inherit' }}><FaFacebookF /></a>
            )}
            {getVal('instagram_link', 'https://www.instagram.com/the_lailahijabs/') && (
              <a href={getVal('instagram_link')} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'inherit' }}><FaInstagram /></a>
            )}
            {getVal('tiktok_link', 'https://www.tiktok.com/@the_lailahijabs') && (
              <a href={getVal('tiktok_link')} target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'inherit' }}><FaTiktok /></a>
            )}
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form">
          <h2>{getVal('form_heading', 'Contact Me')}</h2>
          {submitted ? (
            <div className="success-message" style={{ background: '#3E4930', color: '#ffffff', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '8px', fontFamily: 'Fraunces, serif' }}>{getVal('success_title', 'Message Sent!')}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{getVal('success_text', 'Thank you for reaching out. We have received your query and our team will get in touch with you shortly.')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={getVal('first_name_placeholder', 'First Name *')} 
                  required 
                />
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder={getVal('last_name_placeholder', 'Last Name *')} 
                  required 
                />
              </div>
              <div className="form-row">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={getVal('phone_placeholder', 'Phone Number *')} 
                  required 
                />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={getVal('email_placeholder', 'Email *')} 
                  required 
                />
              </div>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={getVal('message_placeholder', 'Write Your Message *')} 
                rows="5" 
                required
              ></textarea>
              <button type="submit" className="submit-btn">{getVal('submit_btn_text', 'Submit Now')}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;