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
    fetch('http://localhost:5000/api/admin/module/navbar-links')
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

    fetch('http://localhost:5000/api/admin/module/categories-mega-menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMegaMenuItems(data);
        }
      })
      .catch(err => console.error("Failed to fetch mega menu items", err));

    fetch('http://localhost:5000/api/admin/module/categories')
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

  // Comprehensive search catalog with name, slug, price, image, category, and keywords
  const searchCatalog = [
    // Abayas
    { name: "Premium Nida Abaya", slug: "premium-nida-abaya-1", price: "Rs. 5,990", image: "/Categories/abaya/abaya1.png", keywords: "abaya nida black saudi abaya kaftan gown" },
    { name: "Everyday Abaya", slug: "everyday-abaya-2", price: "Rs. 4,990", image: "/Categories/abaya/abaya2.png", keywords: "abaya everyday beige casual modest dress saudi abaya" },
    { name: "Classic Black Abaya", slug: "classic-black-abaya-3", price: "Rs. 5,490", image: "/Categories/abaya/abaya3.png", keywords: "abaya black classic saudi abaya robe" },
    { name: "Elegant Abaya", slug: "elegant-abaya-4", price: "Rs. 6,490", image: "/Categories/abaya/abaya4.png", keywords: "abaya dusty rose elegant chiffon saudi abaya" },
    { name: "Luxury Occasion Abaya", slug: "luxury-occasion-abaya-5", price: "Rs. 7,490", image: "/Categories/abaya/abaya5.png", keywords: "abaya luxury eid occasion olive saudi abaya kaftan" },
    { name: "LAMIA OPEN KAFTAN SET", slug: "lamia-open-kaftan-set", price: "Rs. 9,900", image: "/hero2.png", keywords: "kaftan abaya co-ord set burgundy saudi abaya" },
    { name: "STRUCTURED DAY ABAYA", slug: "structured-day-abaya", price: "Rs. 5,990", image: "/hero2.png", keywords: "abaya structured day olive saudi abaya" },
    { name: "IVORY CHIFFON ABAYA", slug: "ivory-chiffon-abaya", price: "Rs. 6,490", image: "/hero2.png", keywords: "abaya ivory chiffon saudi abaya" },
    { name: "GOLD-TRIM EID ABAYA", slug: "gold-trim-eid-abaya", price: "Rs. 7,490", image: "/hero2.png", keywords: "abaya gold trim eid saudi abaya" },
    { name: "DUSTY ROSE OPEN ABAYA", slug: "dusty-rose-open-abaya", price: "Rs. 6,890", image: "/hero2.png", keywords: "abaya open dusty rose saudi abaya" },
    
    // Hijabs / Scarves
    { name: "Premium Chiffon Hijab", slug: "premium-chiffon-hijab-1", price: "Rs. 2,400", image: "/Categories/hijabs/hijab1.png", keywords: "hijab scarf chiffon dusty rose headscarf veil" },
    { name: "Everyday Jersey Hijab", slug: "everyday-jersey-hijab-2", price: "Rs. 2,200", image: "/Categories/hijabs/hijab2.png", keywords: "hijab scarf jersey olive cotton headscarf veil" },
    { name: "EMBROIDERED CHIFFON HIJAB", slug: "embroidered-chiffon-hijab", price: "Rs. 2,500", image: "/hero2.png", keywords: "hijab scarf embroidered chiffon headscarf veil" },
    { name: "EVERYDAY MODAL HIJAB", slug: "everyday-modal-hijab", price: "Rs. 1,800", image: "/hero2.png", keywords: "hijab scarf modal headscarf veil" },

    // Jilbab (also alias for saudi abaya queries if needed)
    { name: "Two Piece Jilbab Set", slug: "two-piece-jilbab-1", price: "Rs. 6,990", image: "/Categories/jilbab/jilbab.png", keywords: "jilbab saudi abaya overhead 2 piece black khimar full coverage" },
    { name: "Overhead Jilbab", slug: "overhead-jilbab-2", price: "Rs. 6,490", image: "/Categories/jilbab/jilbab2.png", keywords: "jilbab saudi abaya overhead olive one piece khimar" },
    { name: "Premium Jilbab Set", slug: "premium-jilbab-set-3", price: "Rs. 7,490", image: "/Categories/jilbab/jilbab3.png", keywords: "jilbab saudi abaya dusty rose set khimar" },
    { name: "Everyday Jilbab", slug: "everyday-jilbab-4", price: "Rs. 5,990", image: "/Categories/jilbab/jilbab4.png", keywords: "jilbab saudi abaya navy daily khimar" },

    // Chadar / Prayer
    { name: "Classic Irani Chadar", slug: "classic-irani-chadar-1", price: "Rs. 8,990", image: "/Categories/iranichadar/irani1.png", keywords: "chadar irani black traditional drape" },
    { name: "Flowing Irani Chadar", slug: "flowing-irani-chadar-2", price: "Rs. 8,990", image: "/Categories/iranichadar/irani2.png", keywords: "chadar irani black" },
    { name: "Premium Irani Chadar", slug: "premium-irani-chadar-3", price: "Rs. 9,490", image: "/Categories/iranichadar/irani3.png", keywords: "chadar irani black" },
    { name: "Everyday Irani Chadar", slug: "everyday-irani-chadar-4", price: "Rs. 7,990", image: "/Categories/iranichadar/irani4.png", keywords: "chadar irani black" },
    { name: "Lightweight Irani Chadar", slug: "lightweight-irani-chadar-5", price: "Rs. 8,490", image: "/Categories/iranichadar/irani5.png", keywords: "chadar irani black" },
    { name: "Comfort Namaz Chadar", slug: "comfort-namaz-chadar-1", price: "Rs. 3,490", image: "/Categories/namazchadar/namazchaddar.png", keywords: "chadar namaz prayer cotton white" },
    { name: "Classic Round Chadar", slug: "classic-round-chadar-1", price: "Rs. 4,490", image: "/Categories/roundchadar/round1.png", keywords: "chadar round black" }
  ];

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : searchCatalog.filter(p => {
        const q = searchQuery.toLowerCase().trim();
        let searchPool = `${p.name} ${p.keywords || ''} ${p.slug}`.toLowerCase();

        // Dynamically include Category Keywords managed by Admin
        dbCategories.forEach(cat => {
          if (!cat.keywords) return;
          const catKw = (cat.keywords || '').toLowerCase();
          const catSlug = (cat.slug || '').toLowerCase();
          const catName = (cat.name || '').toLowerCase();

          if (catKw.includes(q) || catSlug.includes(q) || catName.includes(q)) {
            // Match products that belong to this category
            if (p.slug.includes(catSlug) || (p.keywords && p.keywords.toLowerCase().includes(catSlug)) || (catSlug && p.name.toLowerCase().includes(catSlug))) {
              searchPool += ` ${catKw} ${catName}`;
            }
          }
        });

        return searchPool.includes(q);
      });

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
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

          {/* Center: Logo */}
          <Link to="/" className="logo" style={{ ...(logoFontSize && { fontSize: logoFontSize }), ...(logoFontColor && { color: logoFontColor }) }}>
            {logoText}
            <span style={{ letterSpacing: '0.2em' }}>{badgeText}</span>
          </Link>

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
                    
                    {/* MEGA MENU COMPONENT INLINED */}
                    {isCategoryDropdownOpen && (
                      <div className="mega-menu-wrapper">
                        <div className="mega-menu-grid">
                          {/* Column 1: ALL CATEGORIES */}
                          <div className="mega-col-list">
                            <h4 className="mega-col-title">ALL CATEGORIES</h4>
                            {allCategoriesLinks.map(cat => (
                              <Link key={cat.id} to={cat.url} className="mega-link" onClick={() => setIsCategoryDropdownOpen(false)}>
                                {cat.label}
                              </Link>
                            ))}
                          </div>

                          {/* Column 2: FEATURED CATEGORIES */}
                          <div className="mega-col-list">
                            <h4 className="mega-col-title">FEATURED CATEGORIES</h4>
                            {featuredCategoriesLinks.map(cat => (
                              <Link key={cat.id} to={cat.url} className="mega-link" onClick={() => setIsCategoryDropdownOpen(false)}>
                                {cat.label}
                              </Link>
                            ))}
                          </div>

                          {/* Column 3 & 4: FEATURED CARDS */}
                          {featuredCards.map(card => (
                            <div key={card.id} className="mega-card-item">
                              <Link to={card.url} onClick={() => setIsCategoryDropdownOpen(false)}>
                                <img src={card.image_url} alt={card.label} />
                                <div className="card-overlay">
                                  <h3>{card.label.toUpperCase()}</h3>
                                  <span className="shop-link">{card.subtitle || 'EXPLORE NOW'}</span>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
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
                {filteredResults.length > 0 ? (
                  <div className="results-grid">
                    {filteredResults.map((product) => (
                      <Link 
                        key={product.slug} 
                        to={`/Products/${product.slug}`} 
                        className="dropdown-result-item"
                        onClick={closeSearch}
                      >
                        <img src={product.image} alt={product.name} />
                        <div className="item-info">
                          <h4>{product.name}</h4>
                          <span>{product.price}</span>
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