import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './PaymentPage.css';

const PaymentPage = () => {
  const { cartItems, cartTotal } = useContext(CartContext);
  const { getSectionContent } = useContent();

  // Dynamic Settings
  const title = getSectionContent('payment_page_settings', 'title', 'Order Confirmation');
  const step3 = getSectionContent('payment_page_settings', 'step_3_label', '3. Payment & Receipt');
  const paymentBadge = getSectionContent('payment_page_settings', 'payment_confirmed_badge', '✓ Order Confirmed');
  const thankYouTitle = getSectionContent('payment_page_settings', 'thank_you_title', 'Thank You For Your Order!');
  const billedToHeader = getSectionContent('payment_page_settings', 'billed_to_header', 'Billed To:');
  const orderInfoHeader = getSectionContent('payment_page_settings', 'order_info_header', 'Order Info:');
  const itemBreakdownHeader = getSectionContent('payment_page_settings', 'item_breakdown_header', 'Item Breakdown');
  const sendWhatsappBtn = getSectionContent('payment_page_settings', 'send_whatsapp_btn', 'Send Receipt via WhatsApp');
  const returnHomeBtn = getSectionContent('payment_page_settings', 'return_home_btn', 'Return to Home');

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
      <h1 className="payment-title">{title}</h1>

      {/* Progress Steps */}
      <div className="payment-steps">
        <Link to="/cart" className="step completed-step">1. Cart</Link>
        <span className="step-divider">—</span>
        <Link to="/checkout" className="step completed-step">2. Checkout</Link>
        <span className="step-divider">—</span>
        <span className="step active">{step3}</span>
      </div>

      <div className="receipt-wrapper">
        <div 
          className="receipt-card" 
          style={{ backgroundColor: '#ffffff', border: '1px solid #e2ded6', borderRadius: '8px' }}
        >
          <div className="receipt-header">
            <div className="success-badge">{paymentBadge}</div>
            <h2>{thankYouTitle}</h2>
            <p className="order-number">Order #{orderDetails.orderId}</p>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-details-grid">
            <div>
              <h4>{billedToHeader}</h4>
              <p><strong>{orderDetails.customerName}</strong></p>
              <p>{orderDetails.phone}</p>
              <p>{orderDetails.address}</p>
            </div>
            <div>
              <h4>{orderInfoHeader}</h4>
              <p><strong>Date:</strong> {orderDetails.date}</p>
              <p><strong>Payment Status:</strong> Confirmed</p>
              <p><strong>Method:</strong> {orderDetails.paymentMethod}</p>
            </div>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-items">
            <h4>{itemBreakdownHeader}</h4>
            <div className="receipt-items-list">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <div className="receipt-item-name">
                    <strong>{item.quantity || item.qty}x</strong> {item.name}
                    <span className="receipt-item-meta" style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>({item.size || "M"} / {item.color || "Olive"})</span>
                  </div>
                  <div className="receipt-item-price">
                    Rs. {(item.price * (item.quantity || item.qty)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-summary" style={{ padding: '15px 0' }}>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>Rs. {orderDetails.subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Discount</span>
              <span>Rs. {orderDetails.discount.toLocaleString()}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total Paid</span>
              <span>Rs. {orderDetails.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="receipt-actions" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            className="whatsapp-receipt-btn" 
            onClick={sendToWhatsApp}
            style={{ padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {sendWhatsappBtn}
          </button>
          <Link 
            to="/" 
            className="home-return-btn"
            style={{ padding: '15px', backgroundColor: '#f5f5f5', color: '#333', textAlign: 'center', textDecoration: 'none', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {returnHomeBtn}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;