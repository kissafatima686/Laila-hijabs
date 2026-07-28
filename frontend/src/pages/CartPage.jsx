import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);
  const { getSectionContent } = useContent();

  const [couponCode, setCouponCode] = React.useState('');
  const [appliedDiscount, setAppliedDiscount] = React.useState(0);
  const [couponMessage, setCouponMessage] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(false);

  // Dynamic Settings
  const title = getSectionContent('cart_page_settings', 'title', 'Cart');
  const step1 = getSectionContent('cart_page_settings', 'step_1_label', '1. Cart');
  const step2 = getSectionContent('cart_page_settings', 'step_2_label', '2. Checkout');
  const step3 = getSectionContent('cart_page_settings', 'step_3_label', '3. Payment');
  
  const emptyTitle = getSectionContent('cart_page_settings', 'empty_cart_title', 'Your shopping cart is empty');
  const emptyMsg = getSectionContent('cart_page_settings', 'empty_cart_message', 'Add some products to your cart and make them yours!');
  const emptyBtn = getSectionContent('cart_page_settings', 'empty_cart_button', 'Explore Products');
  const emptyLink = getSectionContent('cart_page_settings', 'empty_cart_link', '/categories');

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Please enter a coupon code.');
      setCouponApplied(false);
      return;
    }

    if (code === 'LAILA10' || code === 'WELCOME10') {
      const discount = Math.round(cartTotal * 0.1);
      setAppliedDiscount(discount);
      setCouponMessage('✓ Coupon LAILA10 applied! (10% OFF)');
      setCouponApplied(true);
    } else if (code === 'EID2026' || code === 'LAILA20') {
      const discount = Math.round(cartTotal * 0.2);
      setAppliedDiscount(discount);
      setCouponMessage('✓ Coupon EID2026 applied! (20% OFF)');
      setCouponApplied(true);
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Invalid coupon code. Try "LAILA10" or "EID2026".');
      setCouponApplied(false);
    }
  };

  const finalTotal = Math.max(0, cartTotal - appliedDiscount);

  const sendToWhatsApp = () => {
    let message = `*🛒 NEW ORDER REQUEST - LAILA HIJABS*\n\n`;
    message += `*Ordered Items:*\n`;
    cartItems.forEach((item, idx) => {
      message += `▪️ ${item.quantity}x ${item.name} (${item.size || "M"}/${item.color || "Olive"}) - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Subtotal:* Rs. ${cartTotal.toLocaleString()}\n`;
    if (appliedDiscount > 0) {
      message += `*Discount:* -Rs. ${appliedDiscount.toLocaleString()}\n`;
    }
    message += `*Shipping:* FREE\n`;
    message += `*GRAND TOTAL:* *Rs. ${finalTotal.toLocaleString()}*\n\n`;
    message += `Please confirm my order. Thank you! ✨`;

    const whatsappUrl = `https://wa.me/923238399480?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">{title}</h1>

      {/* Progress Steps */}
      <div className="cart-steps">
        <span className="step active">{step1}</span>
        <span className="step-divider">—</span>
        <span className="step">{step2}</span>
        <span className="step-divider">—</span>
        <span className="step">{step3}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', color: '#3E4930', marginBottom: '15px' }}>{emptyTitle}</h2>
          <p style={{ color: '#6b6a58', marginBottom: '30px' }}>{emptyMsg}</p>
          <Link to={emptyLink} style={{ textDecoration: 'none' }}>
            <button className="continue-shopping-btn" style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '12px 30px', fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>{emptyBtn}</button>
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Left Column: Cart Items */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="item-main-info">
                  <img src={item.image || "/hero2.png"} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-desc">{item.description || "Premium Modest Wear Collection"}</p>
                    <p className="item-variant">
                      Size <strong>{item.size || "M"}</strong> / Color <strong>{item.color || "Olive"}</strong>
                    </p>
                    <div className="item-pricing">
                      <span className="current-price">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Actions Bar */}
                <div className="item-actions-bar">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <div className="action-icons">
                    <button onClick={() => removeFromCart(item.id)} className="icon-btn" title="Remove">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
            
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <Link to="/categories" style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
                <button style={{ background: '#eae7dc', border: '1px solid #ccc', color: '#333', padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                  ← CONTINUE SHOPPING
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon Code */}
          <div className="cart-summary-section">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Sub Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="summary-row" style={{ color: '#2E7D32', fontWeight: '600' }}>
                  <span>Discount Code</span>
                  <span>-Rs. {appliedDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>Rs. {finalTotal.toLocaleString()}</span>
              </div>

              <div className="cart-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <button className="checkout-btn" style={{ width: '100%' }}>Proceed to Checkout</button>
                </Link>
              </div>
              <p className="delivery-estimate">Estimated Delivery by <strong>30 July, 2026</strong></p>
            </div>

            {/* Coupon Code Section Directly Below Order Summary */}
            <div className="coupon-box">
              <h4>HAVE A COUPON CODE?</h4>
              <div className="coupon-input-group">
                <input 
                  type="text" 
                  placeholder="Enter discount code (e.g. LAILA10)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button type="button" className="apply-btn" onClick={handleApplyCoupon}>
                  APPLY
                </button>
              </div>
              {couponMessage && (
                <p className="coupon-msg" style={{ fontSize: '12px', marginTop: '10px', marginBottom: 0, color: couponApplied ? '#2E7D32' : '#D9534F', fontWeight: '600' }}>
                  {couponMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;