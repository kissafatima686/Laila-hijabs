import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './CheckOutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const { getSectionContent } = useContent();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
    country: 'Pakistan'
  });

  const [errors, setErrors] = useState({});

  // Dynamic Settings
  const title = getSectionContent('checkout_page_settings', 'title', 'Checkout');
  const step2 = getSectionContent('checkout_page_settings', 'step_2_label', '2. Checkout');
  const contactInfoTitle = getSectionContent('checkout_page_settings', 'contact_info_title', 'Contact Information');
  const emailLabel = getSectionContent('checkout_page_settings', 'email_label', 'Email Address');
  const phoneLabel = getSectionContent('checkout_page_settings', 'phone_label', 'Phone Number');
  const shippingAddressTitle = getSectionContent('checkout_page_settings', 'shipping_address_title', 'Shipping Address');
  const firstNameLabel = getSectionContent('checkout_page_settings', 'first_name_label', 'First Name');
  const lastNameLabel = getSectionContent('checkout_page_settings', 'last_name_label', 'Last Name');
  const streetAddressLabel = getSectionContent('checkout_page_settings', 'street_address_label', 'Street Address');
  const townCityLabel = getSectionContent('checkout_page_settings', 'town_city_label', 'Town / City');
  const postcodeLabel = getSectionContent('checkout_page_settings', 'postcode_label', 'Postcode');
  const countryLabel = getSectionContent('checkout_page_settings', 'country_label', 'Country / Region');
  const continueBtn = getSectionContent('checkout_page_settings', 'continue_to_payment_btn', 'Continue to Payment');
  const returnBtn = getSectionContent('checkout_page_settings', 'return_to_cart_btn', 'Return to Cart');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = `${emailLabel} is required`;
    if (!formData.phone.trim()) newErrors.phone = `${phoneLabel} is required`;
    if (!formData.firstName.trim()) newErrors.firstName = `${firstNameLabel} is required`;
    if (!formData.lastName.trim()) newErrors.lastName = `${lastNameLabel} is required`;
    if (!formData.address.trim()) newErrors.address = `${streetAddressLabel} is required`;
    if (!formData.city.trim()) newErrors.city = `${townCityLabel} is required`;
    if (!formData.postcode.trim()) newErrors.postcode = `${postcodeLabel} is required`;
    if (!formData.country.trim()) newErrors.country = `${countryLabel} is required`;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      setErrors({});
      navigate('/payment');
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">{title}</h1>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <Link to="/cart" className="step completed-step">1. Cart</Link>
        <span className="step-divider">—</span>
        <span className="step active">{step2}</span>
        <span className="step-divider">—</span>
        <span className="step">3. Payment</span>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid" noValidate>
        {/* Left Column: Contact & Shipping Form */}
        <div className="checkout-form-section">
          <div className="form-box">
            <h2>{contactInfoTitle}</h2>
            <div className="input-group">
              <label>{emailLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required 
                style={errors.email ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              />
              {errors.email && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.email}</span>}
            </div>
            <div className="input-group">
              <label>{phoneLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <input 
                type="tel" 
                placeholder="+92 323 8399480" 
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required 
                style={errors.phone ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              />
              {errors.phone && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.phone}</span>}
            </div>

            <h2 className="section-spacing">{shippingAddressTitle}</h2>
            <div className="form-row">
              <div className="input-group">
                <label>{firstNameLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required 
                  style={errors.firstName ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
                />
                {errors.firstName && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.firstName}</span>}
              </div>
              <div className="input-group">
                <label>{lastNameLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required 
                  style={errors.lastName ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
                />
                {errors.lastName && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.lastName}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>{streetAddressLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <input 
                type="text" 
                placeholder="House number and street name" 
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required 
                style={errors.address ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              />
              {errors.address && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{townCityLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required 
                  style={errors.city ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
                />
                {errors.city && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.city}</span>}
              </div>
              <div className="input-group">
                <label>{postcodeLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.postcode}
                  onChange={(e) => handleChange('postcode', e.target.value)}
                  required 
                  style={errors.postcode ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
                />
                {errors.postcode && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.postcode}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>{countryLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <select 
                value={formData.country} 
                onChange={(e) => handleChange('country', e.target.value)}
                required 
                style={errors.country ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              >
                <option value="Pakistan">Pakistan</option>
                <option value="UAE">United Arab Emirates</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
              </select>
              {errors.country && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.country}</span>}
            </div>
          </div>
          
          <div className="checkout-actions">
            <Link to="/cart" className="return-link">‹ {returnBtn}</Link>
            <button type="submit" className="continue-btn">{continueBtn}</button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-box">
            <h3>Order Summary</h3>
            
            {/* Quick item preview */}
            <div className="summary-items-preview">
              {cartItems.map((item) => (
                <div key={item.id} className="preview-item">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <hr className="summary-divider" />

            <div className="summary-row">
              <span>Sub Total</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total to Pay</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <button type="submit" className="payment-btn">Continue to Payment</button>
            
            <Link to="/cart" className="back-to-cart-link">
              ← Return to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;