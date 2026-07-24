import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import { CartContext } from '../../context/CartContext';
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
  const { cartCount, wishlistItems } = useContext(CartContext);
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

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
        const searchPool = `${p.name} ${p.keywords || ''} ${p.slug}`.toLowerCase();
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
          <Link to="/" className="logo">
            Laila
            <span>HIJABS</span>
          </Link>

          {/* Desktop Links with active gold underline */}
          <ul className="nav-links">
            <li>
             <NavLink 
              to="/offers" 
              className={({ isActive }) => isActive ? 'active' : ''}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <span>Offers &amp; Discounts</span>
              <span className="blinking-oval-badge">New</span>
            </NavLink>
            </li>
            <li 
              className="has-dropdown"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <NavLink 
                to="/categories" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
              >
                Categories
              </NavLink>
              
              {/* Mega Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div 
                  className="mega-dropdown-menu"
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <div className="mega-dropdown-inner">
                    {/* Column 1: All Categories */}
                    <div className="mega-column">
                      <h3 className="mega-title">ALL CATEGORIES</h3>
                      <ul className="mega-list">
                        <li><Link to="/categories" onClick={() => setIsCategoryDropdownOpen(false)}>VIEW ALL COLLECTIONS</Link></li>
                        <li><Link to="/categories/abayas" onClick={() => setIsCategoryDropdownOpen(false)}>ABAYAS</Link></li>
                        <li><Link to="/categories/hijabs" onClick={() => setIsCategoryDropdownOpen(false)}>HIJABS</Link></li>
                        <li><Link to="/categories/irani-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>IRANI CHADAR</Link></li>
                        <li><Link to="/categories/jilbab" onClick={() => setIsCategoryDropdownOpen(false)}>JILBAB</Link></li>
                        <li><Link to="/categories/namaz-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>NAMAZ CHADAR</Link></li>
                        <li><Link to="/categories/round-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>ROUND CHADAR</Link></li>
                      </ul>
                    </div>

                    {/* Column 2: Specific Collections */}
                    <div className="mega-column">
                      <h3 className="mega-title">FEATURED CATEGORIES</h3>
                      <ul className="mega-list">
                        <li><Link to="/categories/abayas" onClick={() => setIsCategoryDropdownOpen(false)}>STRUCTURED ABAYAS</Link></li>
                        <li><Link to="/categories/hijabs" onClick={() => setIsCategoryDropdownOpen(false)}>PREMIUM FABRIC HIJABS</Link></li>
                        <li><Link to="/categories/irani-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>TRADITIONAL IRANI CHADAR</Link></li>
                        <li><Link to="/categories/jilbab" onClick={() => setIsCategoryDropdownOpen(false)}>OVERHEAD & 2-PIECE JILBABS</Link></li>
                        <li><Link to="/categories/namaz-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>PRAYER NAMAZ CHADAR</Link></li>
                        <li><Link to="/categories/round-chadar" onClick={() => setIsCategoryDropdownOpen(false)}>CLASSIC ROUND CHADAR</Link></li>
                      </ul>
                    </div>

                    {/* Column 3: Featured Abayas */}
                    <div className="mega-card-item">
                      <Link to="/categories/abayas" onClick={() => setIsCategoryDropdownOpen(false)}>
                        <img src="/Categories/abaya/abaya1.png" alt="Abayas Collection" />
                        <div className="card-overlay">
                          <h3>ABAYAS COLLECTION</h3>
                          <span className="shop-link">EXPLORE NOW</span>
                        </div>
                      </Link>
                    </div>

                    {/* Column 4: Featured Hijabs */}
                    <div className="mega-card-item">
                      <Link to="/categories/hijabs" onClick={() => setIsCategoryDropdownOpen(false)}>
                        <img src="/Categories/hijabs/hijab1.png" alt="Hijabs Collection" />
                        <div className="card-overlay">
                          <h3>HIJABS COLLECTION</h3>
                          <span className="shop-link">EXPLORE NOW</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li><NavLink to="/custom-orders" className={({ isActive }) => isActive ? 'active' : ''}>Custom Design Orders</NavLink></li>
            <li><NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''}>Blogs</NavLink></li>
            <li><NavLink to="/affiliate" className={({ isActive }) => isActive ? 'active' : ''}>Affiliate Program</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink></li>
          </ul>

          {/* Right Action Icons */}
          <div className="nav-icons">
            <button 
              type="button"
              className="icon-btn" 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(true)}
            >
              <IoSearchOutline size={22} />
            </button>
            <Link 
              to="/account" 
              className="icon-btn desktop-only" 
              aria-label="Account"
              style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center' }}
            >
              <IoPersonOutline size={22} />
            </Link>
            <Link 
              to="/wishlist" 
              className="icon-btn desktop-only nav-icon-wrapper" 
              aria-label="Wishlist"
              style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', position: 'relative' }}
            >
              <IoHeartOutline size={22} />
              {wishlistCount > 0 && <span className="nav-icon-badge">{wishlistCount}</span>}
            </Link>
            
            <Link 
              to="/cart" 
              className="icon-btn nav-icon-wrapper" 
              aria-label="Cart"
              style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', position: 'relative' }}
            >
              <IoCartOutline size={22} />
              {cartCount > 0 && <span className="nav-icon-badge">{cartCount}</span>}
            </Link>
          </div>
        </nav>

        {/* FULL WIDTH SEARCH OVERLAY */}
        {isSearchOpen && (
          <div className="full-width-search-bar" ref={searchBarRef}>
            <div className="search-bar-inner">
              <input 
                type="text" 
                placeholder="SEARCH..." 
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
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            Laila
            <span>HIJABS</span>
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
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="mobile-nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
          <li>
            <NavLink 
              to="/offers" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Offers &amp; Discounts</span>
              <span className="blinking-oval-badge" style={{ marginLeft: '4px' }}>New</span>
            </NavLink>
          </li>
          <li><NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Categories</NavLink></li>
          <li><NavLink to="/custom-orders" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Custom Design Orders</NavLink></li>
          <li><NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Blogs</NavLink></li>
          <li><NavLink to="/affiliate" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Affiliate Program</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>About Us</NavLink></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;