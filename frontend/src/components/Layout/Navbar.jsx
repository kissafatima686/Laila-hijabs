import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import { CartContext } from '../../context/CartContext';
import { useContent } from '../../context/useContent';
import { 
  IoSearchOutline, 
  IoCloseOutline, 
  IoPersonOutline, 
  IoHeartOutline, 
  IoCartOutline,
  IoMenuOutline
} from 'react-icons/io5';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, wishlistItems, showCartPopup, setShowCartPopup } = useContext(CartContext);
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;
  const { getSectionContent } = useContent();

  // Settings from CMS
  const logoText = getSectionContent('navbar_settings', 'logo_text', 'Laila');
  const badgeText = getSectionContent('navbar_settings', 'badge_text', 'HIJABS');
  const logoImage = getSectionContent('navbar_settings', 'logo_image', '');
  const logoFontSize = getSectionContent('navbar_settings', 'logo_font_size', '');
  const logoFontColor = getSectionContent('navbar_settings', 'logo_font_color', '');
  const showSearch = getSectionContent('navbar_settings', 'show_search', 'true') !== 'false';
  const showWishlist = getSectionContent('navbar_settings', 'show_wishlist', 'true') !== 'false';
  const showCart = getSectionContent('navbar_settings', 'show_cart', 'true') !== 'false';
  const showAccount = getSectionContent('navbar_settings', 'show_account', 'true') !== 'false';
  const isSticky = getSectionContent('navbar_settings', 'sticky', 'true') !== 'false';

  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const [dynamicNavLinks, setDynamicNavLinks] = useState([]);
  const [megaMenuItems, setMegaMenuItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/module/navbar-links')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const activeLinks = data
            .filter(item => item.status === 'Live')
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          setDynamicNavLinks(activeLinks);
        }
      })
      .catch(err => console.error("Failed to fetch navbar links", err));

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/module/categories-mega-menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMegaMenuItems(data);
        }
      })
      .catch(err => console.error("Failed to fetch mega menu items", err));

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/module/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCategories(data);
        }
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const allCategoriesLinks = megaMenuItems.filter(i => i.group_name === 'all_categories' && i.status === 'Live').sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const featuredCategoriesLinks = megaMenuItems.filter(i => i.group_name === 'featured_categories' && i.status === 'Live').sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const featuredCards = megaMenuItems.filter(i => i.group_name === 'featured_cards' && i.status === 'Live').sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const handleCategoryMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsCategoryDropdownOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 280);
  };

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?search=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setIsSearching(false);
        })
        .catch(err => {
          console.error("Search error:", err);
          setIsSearching(false);
        });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        const searchBtn = event.target.closest('button[aria-label="Search"]');
        if (!searchBtn) {
          closeSearch();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [location.pathname]);

  let headerClassName = 'navbar-header';
  if (isHome) {
    headerClassName += ' is-home';
    if (isScrolled) {
      headerClassName += ' is-scrolled';
    }
  } else {
    headerClassName += ' is-scrolled';
  }
  
  if (!isSticky) {
    headerClassName += ' non-sticky';
  }

  return (
    <div className="nav-wrapper-main">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header */}
      <header className={headerClassName}>
        <nav className="nav-row">
          {/* Left: Hamburger Button */}
          <div className="mobile-left">
            <button 
              className="hamburger-btn" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <IoMenuOutline size={26} />
            </button>
          </div>

          {/* Logo Container (Auto-Adjusting Box) */}
          <div className="logo-container">
            <Link to="/" className="logo" style={{ ...(logoFontSize && { fontSize: logoFontSize }), ...(logoFontColor && { color: logoFontColor }) }}>
              {logoImage ? (
                <img src={logoImage} alt={logoText || "Laila Hijabs"} className="logo-img" />
              ) : (
                <>
                  <span className="logo-main-text">{logoText}</span>
                  {badgeText && <span className="logo-badge-text">{badgeText}</span>}
                </>
              )}
            </Link>
          </div>

          {/* Desktop Links with active gold underline */}
          <ul className="nav-links">
            {dynamicNavLinks.map(link => {
              const hasBadge = link.is_highlighted === 1;

              if (link.url === '/categories' || link.url === '/categories/') {
                return (
                  <li 
                    key={link.link_id || link.url}
                    className="has-mega-menu"
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <NavLink to={link.url} className={({ isActive }) => isActive || isCategoryDropdownOpen ? 'active' : ''} style={hasBadge ? { display: 'inline-flex', alignItems: 'center', gap: '6px' } : undefined}>
                      <span>{link.label}</span>
                      {hasBadge && link.badge_text && (
                        <span className="blinking-oval-badge" style={{ marginLeft: '4px', backgroundColor: link.badge_color || '#ef4444' }}>
                          {link.badge_text}
                        </span>
                      )}
                    </NavLink>
                    
                    {/* Clean Simple Hover Category Dropdown */}
                    {isCategoryDropdownOpen && (
                      <div 
                        className="category-dropdown"
                        onMouseEnter={handleCategoryMouseEnter}
                        onMouseLeave={handleCategoryMouseLeave}
                      >
                        <ul className="dropdown-list">
                          <li className="has-submenu">
                            <Link to="/categories/hijabs" onClick={() => setIsCategoryDropdownOpen(false)}>Hijabs</Link>
                            <div className="sub-menu">
                              <Link to="/Products?category=premium-chiffon" onClick={() => setIsCategoryDropdownOpen(false)}>Premium Chiffon</Link>
                              <Link to="/Products?category=georgette" onClick={() => setIsCategoryDropdownOpen(false)}>Georgette</Link>
                              <Link to="/Products?category=modal" onClick={() => setIsCategoryDropdownOpen(false)}>Modal</Link>
                              <Link to="/Products?category=jersey" onClick={() => setIsCategoryDropdownOpen(false)}>Jersey</Link>
                              <Link to="/Products?category=cotton" onClick={() => setIsCategoryDropdownOpen(false)}>Cotton</Link>
                            </div>
                          </li>
                          <li><Link to="/categories/accessories" onClick={() => setIsCategoryDropdownOpen(false)}>Accessories</Link></li>
                          <li><Link to="/categories/modest-wear" onClick={() => setIsCategoryDropdownOpen(false)}>Modest Wear</Link></li>
                          <li><Link to="/categories/best-sellers" onClick={() => setIsCategoryDropdownOpen(false)}>Best Sellers</Link></li>
                          <li><Link to="/categories/sale" className="sale-link" onClick={() => setIsCategoryDropdownOpen(false)}>Sale &amp; Offers</Link></li>
                        </ul>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.link_id || link.url}>
                  <NavLink to={link.url} className={({ isActive }) => isActive ? 'active' : ''} style={hasBadge ? { display: 'inline-flex', alignItems: 'center', gap: '6px' } : undefined}>
                    <span>{link.label}</span>
                    {hasBadge && link.badge_text && (
                      <span className="blinking-oval-badge" style={{ marginLeft: '4px', backgroundColor: link.badge_color || '#ef4444' }}>
                        {link.badge_text}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Right Action Icons */}
          <div className="nav-icons">
            {showSearch && (
              <button 
                className="icon-btn search-btn" 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <IoSearchOutline size={22} />
              </button>
            )}

            {showAccount && (
              <Link to="/account" className="icon-btn desktop-only" aria-label="Account">
                <IoPersonOutline size={22} />
              </Link>
            )}

            {showWishlist && (
              <Link to="/wishlist" className="icon-btn desktop-only nav-icon-wrapper" aria-label="Wishlist" style={{ position: 'relative' }}>
                <IoHeartOutline size={22} />
                {wishlistCount > 0 && (
                  <span className="nav-icon-badge" aria-live="polite">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {showCart && (
              <Link 
                to="/cart"
                className="icon-btn cart-icon nav-icon-wrapper"
                aria-label="Cart"
                style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}
              >
                <IoCartOutline size={22} />
                {cartCount > 0 && (
                  <span className="nav-icon-badge" aria-live="polite">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </nav>

        {/* FULL WIDTH SEARCH OVERLAY */}
        {isSearchOpen && (
          <div className="full-width-search-bar" ref={searchBarRef}>
            <div className="search-bar-inner">
              <input 
                type="text" 
                placeholder={getSectionContent('search_bar_settings', 'placeholder', 'SEARCH...')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="button" 
                className="close-search-btn" 
                onClick={closeSearch}
                aria-label="Close search"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            {/* Live Dropdown Results */}
            {searchQuery.trim() !== '' && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="no-results-text">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="results-grid">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.slug} 
                        to={`/Products/${product.slug}`} 
                        className="dropdown-result-item"
                        onClick={closeSearch}
                      >
                        <img src={product.image || '/placeholder.png'} alt={product.name} />
                        <div className="item-info">
                          <h4>{product.name}</h4>
                          <span>Rs. {parseFloat(product.price || 0).toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-text">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Spacer to prevent content overlap on pages where navbar is fixed immediately */}
      {!isHome && <div style={{ height: '75px' }} />}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)} style={{ ...(logoFontSize && { fontSize: logoFontSize }), ...(logoFontColor && { color: logoFontColor }) }}>
            {logoText}
            <span style={{ letterSpacing: '0.2em' }}>{badgeText}</span>
          </Link>
          <button 
            className="close-btn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <IoCloseOutline size={26} />
          </button>
        </div>

        {/* 3-Button Strip */}
        <div className="mobile-user-strip">
          <Link to="/account" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
            <IoPersonOutline size={18} />
            <span>Account</span>
          </Link>
          <Link to="/wishlist" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IoHeartOutline size={18} />
              {wishlistCount > 0 && <span className="nav-icon-badge mini">{wishlistCount}</span>}
            </div>
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <IoCartOutline size={18} />
              {cartCount > 0 && <span className="nav-icon-badge mini">{cartCount}</span>}
            </div>
            <span>Cart</span>
            {showCartPopup && (
              <span className="blinking-oval-badge" style={{ marginLeft: '4px' }}>
                Added to Cart 
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="mobile-nav-links">
          {dynamicNavLinks.map(link => {
            const hasBadge = link.is_highlighted === 1;

            return (
              <li key={`mobile-${link.link_id || link.url}`}>
                <NavLink 
                  to={link.url} 
                  className={({ isActive }) => isActive ? 'active' : ''} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={hasBadge ? { display: 'inline-flex', alignItems: 'center', gap: '6px' } : undefined}
                >
                  <span>{link.label}</span>
                  {hasBadge && link.badge_text && (
                    <span className="blinking-oval-badge" style={{ marginLeft: '4px', backgroundColor: link.badge_color || '#ef4444' }}>
                      {link.badge_text}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;