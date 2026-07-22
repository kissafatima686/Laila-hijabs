import { useCart } from '../../hooks/useCart';
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
            <button className="shop-now-btn" onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </button>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
