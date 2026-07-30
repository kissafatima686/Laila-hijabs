// src/pages/CategoriesPage.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoChevronDownOutline, IoChevronUpOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    
    // Fetch categories and products simultaneously
    const catUrl = `http://localhost:5000/api/categories`;
    const prodUrl = categoryId 
      ? `http://localhost:5000/api/products?category=${categoryId}`
      : `http://localhost:5000/api/products`;
      
    Promise.all([
      fetch(catUrl).then(res => res.json()),
      fetch(prodUrl).then(res => res.json())
    ])
      .then(([catsData, prodsData]) => {
        setCategories(catsData);
        
        const formatted = prodsData.map(item => ({
          id: item.product_id,
          name: item.name,
          slug: item.slug,
          category: item.category_slug || item.category,
          sizes: Array.isArray(item.sizes) ? item.sizes.join(" - ") : item.sizes,
          sizesArray: Array.isArray(item.sizes) ? item.sizes : [],
          fabric: item.fabric,
          color: item.color,
          was: item.compare_at_price ? item.compare_at_price.toLocaleString() : null,
          now: item.price ? item.price.toLocaleString() : "0",
          tag: item.badge,
          mainImg: item.image_url,
          altImg: item.thumbnails && item.thumbnails.length > 1 ? item.thumbnails[1] : item.image_url,
          swatches: item.colorSwatches ? item.colorSwatches.map(sw => sw.hex) : [],
          stock_quantity: item.stock_quantity
        }));
        setProducts(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, [categoryId]);

  // Determine current category header
  let currentHeader = {
    title: "All Collections",
    eyebrow: "Explore Our Full Range",
    desc: "Discover every piece from all our exclusive collections.",
    image: "/hero2.png"
  };
  
  let dynamicFilters = [
    { title: "Fabric", options: ["Premium Nida", "Chiffon", "Jersey"] },
    { title: "Color", options: ["Black", "Olive", "Dusty Rose"] }
  ];

  if (categoryId && categories.length > 0) {
    const activeCat = categories.find(c => c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase());
    if (activeCat) {
      currentHeader = {
        title: activeCat.hero_title || activeCat.name,
        eyebrow: activeCat.seo_title || "Premium Modest Fashion",
        desc: activeCat.hero_description || activeCat.description,
        image: activeCat.banner_image || activeCat.image_url || "/hero2.png"
      };
      
      if (activeCat.filters && activeCat.filters.length > 0) {
        dynamicFilters = activeCat.filters.map(f => ({
           title: f, 
           // In a real app, we'd fetch actual values from product variants/specs for these options
           options: f === 'Size' ? ["XS", "S", "M", "L", "XL"] : ["All"] 
        }));
      }
    }
  }

  const filterSections = dynamicFilters;

  const { toggleWishlist, addToCart, wishlistItems } = useContext(CartContext);

  const [selectedFilters, setSelectedFilters] = useState({
    Fabric: [],
    Size: [],
    Color: [],
    Price: []
  });

  const handleCheckboxChange = (sectionTitle, option) => {
    setSelectedFilters(prev => {
      const list = prev[sectionTitle];
      const newList = list.includes(option) ? list.filter(item => item !== option) : [...list, option];
      return { ...prev, [sectionTitle]: newList };
    });
  };

  const handleSelectChange = (sectionTitle, value) => {
    setSelectedFilters(prev => ({ ...prev, [sectionTitle]: value ? [value] : [] }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      Fabric: [],
      Size: [],
      Color: [],
      Price: []
    });
  };

  const handleWishlistClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const priceNum = parseInt(item.now.replace(/,/g, ''), 10);
    toggleWishlist({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: priceNum,
      image: item.mainImg
    });
  };

  const handleCartClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    const priceNum = parseInt(item.now.replace(/,/g, ''), 10);
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: priceNum,
      image: item.mainImg
    });
  };

  const filteredProducts = products.filter(item => {
    // If a specific category is requested in the URL, strictly filter by it
    if (categoryId && item.category !== categoryId) return false;

    if (selectedFilters.Fabric.length > 0 && !selectedFilters.Fabric.includes(item.fabric)) return false;
    if (selectedFilters.Size.length > 0) {
      const hasSize = item.sizesArray.some(sz => selectedFilters.Size.includes(sz));
      if (!hasSize) return false;
    }
    if (selectedFilters.Color.length > 0 && !selectedFilters.Color.includes(item.color)) return false;
    
    if (selectedFilters.Price.length > 0) {
      const priceNum = parseInt(item.now.replace(/,/g, ''), 10);
      const matchesPrice = selectedFilters.Price.some(range => {
        if (range === "Rs. 3,000 – 5,000") return priceNum >= 3000 && priceNum <= 5000;
        if (range === "Rs. 5,000 – 8,000") return priceNum >= 5000 && priceNum <= 8000;
        if (range === "Rs. 8,000+") return priceNum >= 8000;
        return false;
      });
      if (!matchesPrice) return false;
    }
    return true;
  });

  const hasActiveFilters = Object.values(selectedFilters).some(list => list.length > 0);

  return (
    <div className="cat-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/categories">Categories</Link><span>/</span> 
          {currentHeader.title}
        </div>

        {/* Category Hero */}
        <div className="cat-hero">
          <img src={currentHeader.image} alt={currentHeader.title} />
          <div className="cat-hero-copy">
            <span className="eyebrow">{currentHeader.eyebrow}</span>
            <h1>{currentHeader.title}</h1>
            <p>{currentHeader.desc}</p>
          </div>
        </div>

        {/* Horizontal Native Filter Bar (Mobile only) */}
        <div className="horizontal-filter-bar mobile-only">
          <div className="filter-bar-track">
            {filterSections.map((section) => (
              <select
                key={section.title}
                className="native-filter-select"
                value={selectedFilters[section.title][0] || ""}
                onChange={(e) => handleSelectChange(section.title, e.target.value)}
              >
                <option value="">{section.title}</option>
                {section.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ))}

            <Link to="/size-guide" className="size-guide-btn">Size Guide</Link>

            {hasActiveFilters && (
              <div className="clear-filters-btn" onClick={clearFilters}>
                Clear filters
              </div>
            )}
          </div>
        </div>

        <div className="cat-layout">
          {/* Desktop Sidebar Filters */}
          <div className="sidebar-filters desktop-only">
            {filterSections.map(section => (
              <div key={section.title} className="sidebar-filter-group">
                <div className="sidebar-filter-header">
                  <h4>{section.title}</h4>
                  {section.title === 'Size' && (
                    <Link to="/size-guide" className="sidebar-size-guide-link">Size Guide</Link>
                  )}
                </div>
                {section.options.map((opt, i) => (
                  <label className="sidebar-filter-opt" key={i}>
                    <input 
                      type="checkbox" 
                      checked={selectedFilters[section.title].includes(opt)}
                      onChange={() => handleCheckboxChange(section.title, opt)}
                    /> 
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ))}
            
            {hasActiveFilters && (
              <div className="sidebar-clear-btn" onClick={clearFilters}>
                Clear all filters
              </div>
            )}
          </div>

          {/* Main Grid Area */}
          <div className="cat-main-area">
            {/* Toolbar */}
            <div className="toolbar">
              <span>Showing 1–{filteredProducts.length} of {products.length} results</span>
              <select defaultValue="Sort: Featured" className="native-filter-select sort-select">
                <option value="Sort: Featured">Sort: Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest First">Newest First</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="prod-grid">
              {filteredProducts.map((item) => {
                const isWishlisted = wishlistItems?.some(w => (w.id && w.id === item.id) || (w.slug && w.slug === item.slug));
                return (
                  <div className="prod-card" key={item.id}>
                    <div className="prod-frame">
                      {item.tag && <span className="tag">{item.tag}</span>}
                      
                      <div className="cat-card-actions">
                        <div className="wish" aria-label="Add to wishlist" onClick={(e) => handleWishlistClick(e, item)}>
                          <svg viewBox="0 0 24 24"><path fill={isWishlisted ? "#111111" : "none"} stroke="#111111" strokeWidth="1.8" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
                        </div>
                        <div className="cat-cart-btn" aria-label="Add to cart" onClick={(e) => handleCartClick(e, item)}>
                          <FiShoppingCart />
                          <span>Add to Cart</span>
                        </div>
                      </div>
                      
                      <Link to={`/Products/${item.slug}`}>
                        <img className="main" src={item.mainImg} alt={item.name} />
                        <img className="alt" src={item.altImg} alt={`${item.name} detail`} />
                      </Link>
                    </div>

                    <div className="prod-info">
                      <div>
                        <Link to={`/Products/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h4 style={{ margin: 0 }}>{item.name}</h4>
                        </Link>
                        <span className="sizes">{item.sizes}</span>
                        <div style={{ fontSize: '0.85rem', color: item.stock_quantity > 0 ? 'green' : 'red', marginTop: '4px' }}>
                          {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of stock'}
                        </div>
                        <div className="swatches">
                          {item.swatches.map((color, index) => (
                            <span key={index} style={{ background: color }}></span>
                          ))}
                        </div>
                      </div>
                      <div className="price">
                        {item.was && <span className="was">Rs. {item.was}</span>}
                        Rs. {item.now}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <a href="#" className="active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">→</a>
            </div>
          </div>
        </div>
      </div>
      {/* Floating WhatsApp Action Button */}
    </div>
  );
};

export default CategoriesPage;