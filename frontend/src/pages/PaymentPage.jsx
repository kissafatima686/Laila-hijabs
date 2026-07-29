import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './PaymentPage.css';

const PaymentPage = () => {
  const { cartItems, cartTotal } = useContext(CartContext);
  const { getSectionContent } = useContent();

  // Dynamic Settings from Admin CMS
  const title = getSectionContent('payment_page_settings', 'title', 'Order Confirmation');
  const step3 = getSectionContent('payment_page_settings', 'step_3_label', '3. Payment & Receipt');
  const paymentBadge = getSectionContent('payment_page_settings', 'payment_confirmed_badge', '✓ Order Confirmed');
  const thankYouTitle = getSectionContent('payment_page_settings', 'thank_you_title', 'Thank You For Your Order!');
  const billedToHeader = getSectionContent('payment_page_settings', 'billed_to_header', 'Billed To:');
  const orderInfoHeader = getSectionContent('payment_page_settings', 'order_info_header', 'Order Info:');
  const itemBreakdownHeader = getSectionContent('payment_page_settings', 'item_breakdown_header', 'Item Breakdown');
  const subtotalLabel = getSectionContent('payment_page_settings', 'subtotal_label', 'Subtotal');
  const discountLabel = getSectionContent('payment_page_settings', 'discount_label', 'Discount');
  const shippingLabel = getSectionContent('payment_page_settings', 'shipping_label', 'Shipping');
  const freeText = getSectionContent('payment_page_settings', 'free_text', 'Free');
  const totalPaidLabel = getSectionContent('payment_page_settings', 'total_paid_label', 'Total Paid');
  const sendWhatsappBtn = getSectionContent('payment_page_settings', 'send_whatsapp_btn', 'Send Receipt to WhatsApp');
  const whatsappNumber = getSectionContent('payment_page_settings', 'whatsapp_number', '923238399480');
  const returnHomeBtn = getSectionContent('payment_page_settings', 'return_home_btn', 'Return to Home');
  const returnHomeLink = getSectionContent('payment_page_settings', 'return_home_link', '/');

  // Gradually increment order ID for every order (starts at LH-962355, LH-962356, LH-962357...)
  const [orderId] = React.useState(() => {
    const savedNum = parseInt(localStorage.getItem('laila_last_order_num') || '962354', 10);
    const nextNum = savedNum + 1;
    localStorage.setItem('laila_last_order_num', nextNum.toString());
    return `LH-${nextNum}`;
  });
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Resolve cart items
  const finalItems = cartItems.length > 0 ? cartItems : [
    { name: "Premium Chiffon Hijab", size: "M", color: "Olive", quantity: 1, price: 2400 }
  ];
  const finalTotal = cartItems.length > 0 ? cartTotal : 2400;

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
    const businessPhoneNumber = whatsappNumber || "923238399480"; 
    
    let message = `*ORDER CONFIRMATION RECEIPT - LAILA HIJABS*\n\n`;
    message += `*Order ID:* #${orderDetails.orderId}\n`;
    message += `*Date:* ${orderDetails.date}\n`;
    message += `*Customer:* ${orderDetails.customerName}\n`;
    message += `*Phone:* ${orderDetails.phone}\n`;
    message += `*Shipping Address:* ${orderDetails.address}\n\n`;
    message += `*--- ITEM BREAKDOWN ---*\n`;
    
    orderDetails.items.forEach(item => {
      message += `▪️ ${item.quantity || item.qty || 1}x ${item.name} (Size: ${item.size || "M"} | Color: ${item.color || "Olive"}) - Rs. ${(item.price * (item.quantity || item.qty || 1)).toLocaleString()}\n`;
    });

    message += `\n*Subtotal:* Rs. ${orderDetails.subtotal.toLocaleString()}\n`;
    message += `*Discount:* Rs. ${orderDetails.discount.toLocaleString()}\n`;
    message += `*Shipping:* FREE\n`;
    message += `*TOTAL PAID:* *Rs. ${orderDetails.total.toLocaleString()}*\n\n`;
    message += `Thank you for shopping with us! ✨`;

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
        <div className="receipt-card">
          <div className="receipt-header">
            <div className="success-badge">{paymentBadge}</div>
            <h2 className="thank-you-title">{thankYouTitle}</h2>
            <p className="order-number">Order #{orderDetails.orderId}</p>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-details-grid">
            <div>
              <h4 className="grid-heading">{billedToHeader}</h4>
              <p className="customer-info">{orderDetails.customerName}</p>
              <p className="customer-info">{orderDetails.phone}</p>
              <p className="customer-info">{orderDetails.address}</p>
            </div>
            <div>
              <h4 className="grid-heading">{orderInfoHeader}</h4>
              <p className="order-info-line"><span>Date:</span> {orderDetails.date}</p>
              <p className="order-info-line"><span>Payment Status:</span> Confirmed</p>
              <p className="order-info-line"><span>Method:</span> {orderDetails.paymentMethod}</p>
            </div>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-items-section">
            <h4 className="section-heading">{itemBreakdownHeader}</h4>
            <div className="receipt-items-list">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <div className="item-name-block">
                    <span className="item-title"><strong>{(item.quantity || item.qty || 1)}x</strong> {item.name}</span>
                    <span className="item-meta">Size: {item.size || "M"} | Color: {item.color || "Olive"}</span>
                  </div>
                  <div className="item-price">
                    Rs. {(item.price * (item.quantity || item.qty || 1)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-summary">
            <div className="summary-row">
              <span>{subtotalLabel}</span>
              <span>Rs. {orderDetails.subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>{discountLabel}</span>
              <span>Rs. {orderDetails.discount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>{shippingLabel}</span>
              <span className="free-tag">{freeText}</span>
            </div>
            <div className="total-divider" />
            <div className="summary-row total-paid-row">
              <span>{totalPaidLabel}</span>
              <span>Rs. {orderDetails.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="receipt-actions">
            <button className="whatsapp-btn" onClick={sendToWhatsApp}>
              {sendWhatsappBtn}
            </button>
            <Link to={returnHomeLink || "/"} className="home-btn">
              {returnHomeBtn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;