import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { toggleWishlist, addToCart, wishlistItems } = useContext(CartContext);
  const navigate = useNavigate();

  const isWishlisted = wishlistItems?.some(item => item.id === product.id || item.slug === product.slug);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="image-container">
        <Link to={`/Products/${product.slug}`}>
          <img className="product-image" src={product.image} alt={product.name} />
        </Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className="product-card-actions">
          <button className="wishlist-btn" aria-label="Add to wishlist" onClick={handleWishlistClick}>
            <FiHeart fill={isWishlisted ? "#111111" : "none"} color="#111111" />
          </button>
          <button className="cart-btn" aria-label="Add to cart" onClick={handleCartClick}>
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <Link to={`/Products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">Rs. {product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;