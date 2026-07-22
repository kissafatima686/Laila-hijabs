import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);

  const sendToWhatsApp = () => {
    let message = `*🛒 NEW ORDER REQUEST - LAILA HIJABS*\n\n`;
    message += `*Ordered Items:*\n`;
    cartItems.forEach((item, idx) => {
      message += `▪️ ${item.quantity}x ${item.name} (${item.size || "M"}/${item.color || "Olive"}) - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Subtotal:* Rs. ${cartTotal.toLocaleString()}\n`;
    message += `*Shipping:* FREE\n`;
    message += `*GRAND TOTAL:* *Rs. ${cartTotal.toLocaleString()}*\n\n`;
    message += `Please confirm my order. Thank you! ✨`;

    const whatsappUrl = `https://wa.me/923238399480?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Cart</h1>

      {/* Progress Steps */}
      <div className="cart-steps">
        <span className="step active">1. Cart</span>
        <span className="step-divider">—</span>
        <span className="step">2. Checkout</span>
        <span className="step-divider">—</span>
        <span className="step">3. Payment</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', color: '#3E4930', marginBottom: '15px' }}>Your shopping cart is empty</h2>
          <p style={{ color: '#6b6a58', marginBottom: '30px' }}>Add some products to your cart and make them yours!</p>
          <Link to="/categories" style={{ textDecoration: 'none' }}>
            <button className="continue-shopping-btn" style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '12px 30px', fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>Explore Products</button>
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
              <Link to="/categories" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#eae7dc', border: '1px solid #ccc', color: '#333', padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                  ← CONTINUE SHOPPING
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-section">
            <div className="summary-box">
              <h3>Order Summary</h3>
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
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>

              <div className="cart-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <button className="checkout-btn" style={{ width: '100%' }}>Proceed to Checkout</button>
                </Link>
               
              </div>
              <p className="delivery-estimate">Estimated Delivery by <strong>30 July, 2026</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;