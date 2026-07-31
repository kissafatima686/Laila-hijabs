import React, { useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('laila_hijabs_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const parts = user.name ? user.name.split(' ') : [''];
          const firstName = parts[0];
          const lastName = parts.slice(1).join(' ');

          let address = '';
          let city = '';
          const addressStr = localStorage.getItem(`laila_hijabs_addresses_${user.email}`);
          if (addressStr) {
            const addresses = JSON.parse(addressStr);
            if (Array.isArray(addresses) && addresses.length > 0) {
              const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
              address = defaultAddr.street || '';
              city = defaultAddr.city || '';
            }
          }

          setFormData(prev => ({
            ...prev,
            email: user.email,
            phone: user.phone || '',
            firstName: firstName || '',
            lastName: lastName || '',
            address: address,
            city: city
          }));
        }
      }
    } catch (e) {}
  }, []);

  // Dynamic Settings from Admin CMS
  const title = getSectionContent('checkout_page_settings', 'title', 'Checkout');
  const step1 = getSectionContent('checkout_page_settings', 'step_1_label', '1. Cart');
  const step2 = getSectionContent('checkout_page_settings', 'step_2_label', '2. Checkout');
  const step3 = getSectionContent('checkout_page_settings', 'step_3_label', '3. Payment');

  const contactTitle = getSectionContent('checkout_page_settings', 'contact_title', 'Contact Information');
  const emailLabel = getSectionContent('checkout_page_settings', 'email_label', 'Email Address');
  const emailPlaceholder = getSectionContent('checkout_page_settings', 'email_placeholder', 'you@example.com');
  const phoneLabel = getSectionContent('checkout_page_settings', 'phone_label', 'Phone Number');
  const phonePlaceholder = getSectionContent('checkout_page_settings', 'phone_placeholder', '+92 323 8399480');

  const shippingTitle = getSectionContent('checkout_page_settings', 'shipping_title', 'Shipping Address');
  const firstNameLabel = getSectionContent('checkout_page_settings', 'first_name_label', 'First Name');
  const lastNameLabel = getSectionContent('checkout_page_settings', 'last_name_label', 'Last Name');
  const streetLabel = getSectionContent('checkout_page_settings', 'street_label', 'Street Address');
  const streetPlaceholder = getSectionContent('checkout_page_settings', 'street_placeholder', 'House number and street name');
  const cityLabel = getSectionContent('checkout_page_settings', 'city_label', 'Town / City');
  const postcodeLabel = getSectionContent('checkout_page_settings', 'postcode_label', 'Postcode');
  const countryLabel = getSectionContent('checkout_page_settings', 'country_label', 'Country / Region');

  const summaryHeading = getSectionContent('checkout_page_settings', 'summary_heading', 'Order Summary');
  const subtotalLabel = getSectionContent('checkout_page_settings', 'subtotal_label', 'Sub Total');
  const shippingLabel = getSectionContent('checkout_page_settings', 'shipping_label', 'Shipping');
  const shippingValue = getSectionContent('checkout_page_settings', 'shipping_value', 'Free');
  const totalPayLabel = getSectionContent('checkout_page_settings', 'total_pay_label', 'Total to Pay');
  const paymentButtonText = getSectionContent('checkout_page_settings', 'payment_button_text', 'Continue to Payment');
  const returnCartText = getSectionContent('checkout_page_settings', 'return_cart_text', '← Return to Cart');

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
    if (!formData.address.trim()) newErrors.address = `${streetLabel} is required`;
    if (!formData.city.trim()) newErrors.city = `${cityLabel} is required`;
    if (!formData.postcode.trim()) newErrors.postcode = `${postcodeLabel} is required`;
    if (!formData.country.trim()) newErrors.country = `${countryLabel} is required`;
    return newErrors;
  };

  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setProcessing(true);
    try {
      // Get affiliate_code from cookies if it exists
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      
      const affiliateCode = getCookie('affiliate_code');

      const payload = {
        recipient_name: `${formData.firstName} ${formData.lastName}`,
        recipient_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        postal_code: formData.postcode,
        payment_method: 'WhatsApp Confirmation',
        items: cartItems.map(item => ({
          product_id: item.id || item.product_id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        })),
        total_amount: cartTotal,
        affiliate_code: affiliateCode
      };

      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        // Navigate to payment page and pass order data
        navigate('/payment', { state: { orderDetails: { ...formData, orderId: data.orderId, cartItems, cartTotal } } });
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout.');
    }
    setProcessing(false);
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">{title}</h1>
      
      {/* Progress Steps */}
      <div className="checkout-steps">
        <Link to="/cart" className="step completed-step">{step1}</Link>
        <span className="step-divider">—</span>
        <span className="step active">{step2}</span>
        <span className="step-divider">—</span>
        <span className="step upcoming-step">{step3}</span>
      </div>

      <form onSubmit={handleSubmit} className="checkout-content-grid">
        {/* Left Column: Forms */}
        <div className="checkout-forms-section">
          {/* Contact Info Card */}
          <div className="checkout-card">
            <h3>{contactTitle}</h3>
            
            <div className="input-group">
              <label>{emailLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <input 
                type="email" 
                placeholder={emailPlaceholder}
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
                placeholder={phonePlaceholder}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                style={errors.phone ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              />
              {errors.phone && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="checkout-card">
            <h3>{shippingTitle}</h3>
            
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
              <label>{streetLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
              <input 
                type="text" 
                placeholder={streetPlaceholder}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
                style={errors.address ? { borderColor: '#c92a2a', backgroundColor: '#fff5f5' } : {}}
              />
              {errors.address && <span style={{ color: '#c92a2a', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: '500' }}>{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{cityLabel} <span style={{ color: '#c92a2a' }}>*</span></label>
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
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-box">
            <h3>{summaryHeading}</h3>
            
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
              <span>{subtotalLabel}</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>{shippingLabel}</span>
              <span className="free-shipping">{shippingValue}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total-row">
              <span>{totalPayLabel}</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <button type="submit" className="payment-button" disabled={processing} style={{ opacity: processing ? 0.7 : 1 }}>
              {processing ? 'Processing...' : paymentButtonText}
            </button>
            
            <Link to="/cart" className="back-to-cart-link">
              {returnCartText}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;