import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContent } from '../context/useContent';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useContext(CartContext);
  const { getSectionContent } = useContent();

  const title = getSectionContent('wishlist_page_settings', 'title', 'My Wishlist');
  const emptyMessage = getSectionContent('wishlist_page_settings', 'empty_wishlist_message', 'Your wishlist is currently empty');
  const emptyButton = getSectionContent('wishlist_page_settings', 'empty_wishlist_button', 'Explore Products');
  const emptyLink = getSectionContent('wishlist_page_settings', 'empty_wishlist_link', '/categories');

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">{title}</h1>
        <p className="wishlist-count">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', color: '#3E4930', marginBottom: '15px' }}>{emptyMessage}</h2>
          <p style={{ color: '#6b6a58', marginBottom: '30px' }}>Save your favorite items here while you shop to easily find them later.</p>
          <Link to={emptyLink} style={{ textDecoration: 'none' }}>
            <button className="continue-shopping-btn" style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '12px 30px', fontSize: '14px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>{emptyButton}</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="image-container">
                  <Link to={`/Products/${item.slug}`}>
                    <img src={item.image || "/hero2.png"} alt={item.name} className="wishlist-image" />
                  </Link>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                  {!item.inStock && <span className="out-of-stock-badge">Out of Stock</span>}
                </div>

                <div className="wishlist-details">
                  <Link to={`/Products/${item.slug}`} className="item-link" style={{ textDecoration: 'none', color: '#3E4930' }}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="item-color">{item.color || "Olive"}</p>
                  <div className="item-pricing">
                    <span className="current-price">Rs. {item.price.toLocaleString()}</span>
                  </div>

                  <div className="wishlist-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                    <button 
                      className={`move-to-bag-btn ${!item.inStock ? 'disabled' : ''}`}
                      onClick={() => item.inStock && moveToCart(item)}
                      disabled={!item.inStock}
                      style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {item.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                    </button>
                    <button 
                      className="delete-wish-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      style={{ width: '100%', height: '40px', background: '#eae7dc', border: '1px solid #ccc', color: '#333', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }}
                    >
                      DELETE FROM WISHLIST
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="wishlist-footer-actions" style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
            <Link to="/categories" style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
              <button className="continue-shopping-btn-main" style={{ backgroundColor: '#3E4930', color: '#fff', border: 'none', padding: '14px 36px', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;