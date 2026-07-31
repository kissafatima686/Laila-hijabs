import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);
  const { getSectionContent } = useContent();

  const [couponCode, setCouponCode] = React.useState('');
  const [appliedDiscount, setAppliedDiscount] = React.useState(0);
  const [couponMessage, setCouponMessage] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(false);

  const bundlesRaw = getSectionContent('offers_bundles_page', 'bundles', []);
  const activeBundles = bundlesRaw.filter(b => b.status !== 'Draft');

  // Dynamic Settings
  const title = getSectionContent('cart_page_settings', 'title', 'Cart');
  const step1 = getSectionContent('cart_page_settings', 'step_1_label', '1. Cart');
  const step2 = getSectionContent('cart_page_settings', 'step_2_label', '2. Checkout');
  const step3 = getSectionContent('cart_page_settings', 'step_3_label', '3. Payment');
  
  const emptyTitle = getSectionContent('cart_page_settings', 'empty_cart_title', 'Your shopping cart is empty');
  const emptyMsg = getSectionContent('cart_page_settings', 'empty_cart_message', 'Add some products to your cart and make them yours!');
  const emptyBtn = getSectionContent('cart_page_settings', 'empty_cart_button', 'EXPLORE PRODUCTS');
  const emptyLink = getSectionContent('cart_page_settings', 'empty_cart_link', '/products');

  // Dynamic Order Summary Settings
  const summaryHeading = getSectionContent('cart_page_settings', 'summary_heading', 'Order Summary');
  const subtotalLabel = getSectionContent('cart_page_settings', 'subtotal_label', 'Sub Total');
  const shippingLabel = getSectionContent('cart_page_settings', 'shipping_label', 'Shipping');
  const shippingValue = getSectionContent('cart_page_settings', 'shipping_value', 'Free');
  const totalLabel = getSectionContent('cart_page_settings', 'total_label', 'Total');
  const checkoutBtnText = getSectionContent('cart_page_settings', 'checkout_btn_text', 'Proceed to Checkout');
  const continueShoppingText = getSectionContent('cart_page_settings', 'continue_shopping_btn_text', '← CONTINUE SHOPPING');
  
  // Dynamic Delivery Date Logic
  const deliveryDays = parseInt(getSectionContent('cart_page_settings', 'estimated_delivery_days', '2'), 10) || 2;
  const customDeliveryDate = getSectionContent('cart_page_settings', 'custom_delivery_date', '');
  const deliveryPrefix = getSectionContent('cart_page_settings', 'estimated_delivery_prefix', 'Estimated Delivery by');

  const getComputedDeliveryText = () => {
    if (customDeliveryDate && customDeliveryDate.trim() !== '') {
      return `${deliveryPrefix} ${customDeliveryDate.trim()}`;
    }
    const d = new Date();
    d.setDate(d.getDate() + deliveryDays);
    const day = d.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${deliveryPrefix} ${day} ${month}, ${year}`;
  };

  const deliveryEstimateText = getComputedDeliveryText();

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Please enter a coupon code.');
      setCouponApplied(false);
      return;
    }

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/module/coupons');
      const data = await res.json();
      const activeCoupons = Array.isArray(data) ? data : [];
      const found = activeCoupons.find(c => c.code && c.code.toUpperCase() === code && (c.status || 'Active') === 'Active');

      if (found) {
        let discount = 0;
        if (found.discount_type === 'fixed' || (found.discount_amount && Number(found.discount_amount) > 0)) {
          discount = parseFloat(found.discount_amount || 0);
        } else {
          const pct = parseFloat(found.discount_percentage || 10);
          discount = Math.round(cartTotal * (pct / 100));
        }
        setAppliedDiscount(discount);
        setCouponMessage(`✓ Coupon ${found.code} applied! (${found.description || `${found.discount_percentage}% OFF`})`);
        setCouponApplied(true);
      } else {
        if (code === 'LAILA10' || code === 'WELCOME10') {
          setAppliedDiscount(Math.round(cartTotal * 0.1));
          setCouponMessage('✓ Coupon LAILA10 applied! (10% OFF)');
          setCouponApplied(true);
        } else if (code === 'EID2026') {
          setAppliedDiscount(Math.round(cartTotal * 0.2));
          setCouponMessage('✓ Coupon EID2026 applied! (20% OFF)');
          setCouponApplied(true);
        } else {
          setAppliedDiscount(0);
          setCouponMessage('Invalid or expired coupon code.');
          setCouponApplied(false);
        }
      }
    } catch (err) {
      if (code === 'LAILA10') {
        setAppliedDiscount(Math.round(cartTotal * 0.1));
        setCouponMessage('✓ Coupon LAILA10 applied! (10% OFF)');
        setCouponApplied(true);
      } else {
        setAppliedDiscount(0);
        setCouponMessage('Invalid coupon code.');
        setCouponApplied(false);
      }
    }
  };

  const finalTotal = Math.max(0, cartTotal - appliedDiscount);

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
                    <p className="item-desc">{item.description || "Lightweight and breathable."}</p>
                    <p className="item-variant">
                      Size <strong>{item.size || "S"}</strong> / Color <strong>{item.color || "Dusty Rose"}</strong>
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
              <Link to="/products" style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
                <button style={{ background: '#eae7dc', border: '1px solid #ccc', color: '#333', padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                  {continueShoppingText}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon Code */}
          <div className="cart-summary-section">
            <div className="summary-box">
              <h3>{summaryHeading}</h3>
              <div className="summary-row">
                <span>{subtotalLabel}</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="summary-row" style={{ color: '#2E7D32', fontWeight: '600' }}>
                  <span>Discount Code</span>
                  <span>-Rs. {appliedDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row">
                <span>{shippingLabel}</span>
                <span className="free-shipping">{shippingValue}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>{totalLabel}</span>
                <span>Rs. {finalTotal.toLocaleString()}</span>
              </div>

              <div className="cart-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <button className="checkout-btn" style={{ width: '100%' }}>{checkoutBtnText}</button>
                </Link>
              </div>
              <p className="delivery-estimate">{deliveryEstimateText}</p>
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
      
      {/* Upsell Section */}
      {cartItems.length > 0 && activeBundles.length > 0 && (
        <div style={{ marginTop: '60px', padding: '40px 0', borderTop: '1px solid #eae7dc' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#3E4930', textAlign: 'center', marginBottom: '30px' }}>Complete Your Look & Save Up To 30%</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
            {activeBundles.map((b, idx) => (
              <Link key={idx} to={b.slug ? `/Products/${b.slug}` : '#'} style={{ textDecoration: 'none', minWidth: '280px', flex: '0 0 auto', border: '1px solid #eae7dc', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#22c55e', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px' }}>{b.savings}</span>
                  <img src={b.image_url || '/hero1.png'} alt={b.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1A2010', fontFamily: 'Fraunces, serif' }}>{b.title}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b6a58' }}>{b.items_included}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#B8935B' }}>{b.bundle_price}</span>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px' }}>{b.original_price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;