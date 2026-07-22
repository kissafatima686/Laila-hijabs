import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const { cartItems, cartTotal } = useContext(CartContext);

  // Generate random order ID
  const orderId = "LH-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Resolve cart items
  const finalItems = cartItems.length > 0 ? cartItems : [
    { name: "LAMIA OPEN KAFTAN SET", size: "M", color: "Burgundy", quantity: 1, price: 9900 },
    { name: "PLEATED SATIN ABAYA", size: "L", color: "Olive", quantity: 2, price: 12900 }
  ];
  const finalTotal = cartItems.length > 0 ? cartTotal : 35700;

  const orderDetails = {
    orderId: orderId,
    date: dateStr,
    customerName: "Valued Customer",
    phone: "+92 323 8399480",
    address: "Islamabad, Pakistan",
    paymentMethod: "WhatsApp Confirmation Payment",
    items: finalItems,
    subtotal: finalTotal,
    discount: 0,
    shipping: 0,
    total: finalTotal
  };

  // Function to format and open WhatsApp with the Receipt
  const sendToWhatsApp = () => {
    const businessPhoneNumber = "923238399480"; 
    
    let message = `*ORDER CONFIRMATION RECEIPT - LAILA HIJABS*\n\n`;
    message += `*Order ID:* #${orderDetails.orderId}\n`;
    message += `*Date:* ${orderDetails.date}\n`;
    message += `*Customer:* ${orderDetails.customerName}\n`;
    message += `*Phone:* ${orderDetails.phone}\n`;
    message += `*Shipping Address:* ${orderDetails.address}\n\n`;
    message += `*--- ORDERED ITEMS ---*\n`;
    
    orderDetails.items.forEach(item => {
      message += `▪️ ${item.quantity || item.qty}x ${item.name} (${item.size || "M"}/${item.color || "Olive"}) - Rs. ${(item.price * (item.quantity || item.qty)).toLocaleString()}\n`;
    });

    message += `\n*Subtotal:* Rs. ${orderDetails.subtotal.toLocaleString()}\n`;
    message += `*Discount:* Rs. ${orderDetails.discount.toLocaleString()}\n`;
    message += `*Shipping:* FREE\n`;
    message += `*TOTAL PAID:* *Rs. ${orderDetails.total.toLocaleString()}*\n\n`;
    message += `Thank you for shopping with us! We will process your order soon. ✨`;

    // Encode the text for URL and open WhatsApp
    const whatsappUrl = `https://wa.me/${businessPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Order Confirmation</h1>

      {/* Progress Steps */}
      <div className="payment-steps">
        <Link to="/cart" className="step completed-step">1. Cart</Link>
        <span className="step-divider">—</span>
        <Link to="/checkout" className="step completed-step">2. Checkout</Link>
        <span className="step-divider">—</span>
        <span className="step active">3. Payment & Receipt</span>
      </div>

      <div className="receipt-wrapper">
  {/* Added inline background color and border to guarantee a pure white box */}
  <div 
    className="receipt-card" 
    style={{ backgroundColor: '#ffffff', border: '1px solid #e2ded6', borderRadius: '8px' }}
  >
    <div className="receipt-header">
      <div className="success-badge">✓ Order Confirmed</div>
      <h2>Thank You For Your Order!</h2>
      <p className="order-number">Order #{orderDetails.orderId}</p>
    </div>

    <hr className="receipt-divider" />

    <div className="receipt-details-grid">
      <div>
        <h4>Billed To:</h4>
        <p><strong>{orderDetails.customerName}</strong></p>
        <p>{orderDetails.phone}</p>
        <p>{orderDetails.address}</p>
      </div>
      <div>
        <h4>Order Info:</h4>
        <p><strong>Date:</strong> {orderDetails.date}</p>
        <p><strong>Payment Status:</strong> Confirmed</p>
        <p><strong>Method:</strong> {orderDetails.paymentMethod}</p>
      </div>
    </div>

    <hr className="receipt-divider" />

    <div className="receipt-items">
      <h4>Item Breakdown</h4>
      {orderDetails.items.map((item, idx) => (
        <div key={idx} className="receipt-item-row">
          <div>
            <span className="item-title">{(item.quantity || item.qty)}x {item.name}</span>
            <span className="item-meta">Size: {item.size || "M"} | Color: {item.color || "Olive"}</span>
          </div>
          <span className="item-price">Rs. {(item.price * (item.quantity || item.qty)).toLocaleString()}</span>
        </div>
      ))}
    </div>

    <hr className="receipt-divider" />

    <div className="receipt-totals">
      <div className="total-line">
        <span>Subtotal</span>
        <span>Rs. {orderDetails.subtotal.toLocaleString()}</span>
      </div>
      <div className="total-line">
        <span>Discount</span>
        <span>Rs. {orderDetails.discount.toLocaleString()}</span>
      </div>
      <div className="total-line">
        <span>Shipping</span>
        <span className="free-tag">Free</span>
      </div>
      <div className="total-line grand-total">
        <span>Total Paid</span>
        <span>Rs. {orderDetails.total.toLocaleString()}</span>
      </div>
    </div>

    <div className="receipt-actions">
      <button onClick={sendToWhatsApp} className="whatsapp-btn">
        Send Receipt to WhatsApp
      </button>

      {/* FIXED: Removed the inner <button> tag to prevent browser click bugs */}
      <Link 
        to="/" 
        className="home-btn" 
        style={{ textDecoration: 'none', width: '100%', display: 'inline-block', textAlign: 'center', boxSizing: 'border-box' }}
      >
        Return to Shop
      </Link>
    </div>
  </div>
</div>
    </div>
  );
};

export default PaymentPage;