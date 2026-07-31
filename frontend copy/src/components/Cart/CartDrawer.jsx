import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useContent } from '../../context/useContent';
import './CartDrawer.css';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const { getSectionContent } = useContent();
  const bundlesRaw = getSectionContent('offers_bundles_page', 'bundles', []);
  const activeBundles = bundlesRaw.filter(b => b.status !== 'Draft');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    alert('Thank you for your purchase! (This is a simulated checkout flow)');
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-view">
            <div className="empty-cart-icon">🛍️</div>
            <p className="empty-cart-title">Your cart is empty</p>
            <p className="empty-cart-sub">Add some elegant hijabs to get started!</p>
            <Link to="/categories" style={{ textDecoration: 'none' }} onClick={() => { setIsCartOpen(false); window.scrollTo(0, 0); }}>
              <button className="shop-now-btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <div className="cart-item-meta">
                      <span className="cart-item-category">{item.category}</span>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-variant">{item.color}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                        <span className="qty-number">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
                      </div>
                      <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-total">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="shipping-info">Shipping & taxes calculated at checkout.</p>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="clear-all-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
            
            {activeBundles.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid #e1e1e1', backgroundColor: '#f9f9f9' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1A2010' }}>Complete Your Look (Save up to 30%)</h4>
                <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px' }}>
                  {activeBundles.map((b, idx) => (
                    <Link key={idx} to={b.slug ? `/Products/${b.slug}` : '#'} onClick={() => setIsCartOpen(false)} style={{ textDecoration: 'none', minWidth: '200px', border: '1px solid #e1e1e1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                      <img src={b.image_url || '/hero1.png'} alt={b.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <div style={{ padding: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: 'bold' }}>{b.savings}</div>
                        <h5 style={{ margin: '4px 0', fontSize: '12px', color: '#1A2010' }}>{b.title}</h5>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1A2010' }}>{b.bundle_price} <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '10px' }}>{b.original_price}</span></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
