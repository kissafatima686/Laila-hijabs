// src/pages/CategoriesPage.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoChevronDownOutline, IoChevronUpOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const filterSections = [
    { title: "Fabric", options: ["Nida Crepe", "Chiffon", "Linen Blend", "Silk Satin"] },
    { title: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { title: "Color", options: ["Olive", "Black", "Ivory", "Dusty Rose"] },
    { title: "Price", options: ["Rs. 3,000 – 5,000", "Rs. 5,000 – 8,000", "Rs. 8,000+"] }
  ];

  const products = [
    // Abayas
    { id: 1, name: "Premium Nida Abaya", slug: "premium-nida-abaya-1", category: "abayas", sizes: "XS – XXL", sizesArray: ["XS", "S", "M", "L", "XL", "XXL"], fabric: "Nida Crepe", color: "Black", now: "5,990", tag: "NEW IN", mainImg: "/Categories/abaya/abaya1.png", altImg: "/Categories/abaya/abaya2.png", swatches: ["#1c1c1a"] },
    { id: 2, name: "Everyday Abaya", slug: "everyday-abaya-2", category: "abayas", sizes: "XS – XXL", sizesArray: ["XS", "S", "M", "L", "XL", "XXL"], fabric: "Nida Crepe", color: "Beige", was: "5,990", now: "4,990", tag: "Bestseller", mainImg: "/Categories/abaya/abaya2.png", altImg: "/Categories/abaya/abaya3.png", swatches: ["#EFE4CC"] },
    { id: 3, name: "Classic Black Abaya", slug: "classic-black-abaya-3", category: "abayas", sizes: "XS – XXL", sizesArray: ["XS", "S", "M", "L", "XL", "XXL"], fabric: "Nida Crepe", color: "Black", now: "5,490", mainImg: "/Categories/abaya/abaya3.png", altImg: "/Categories/abaya/abaya4.png", swatches: ["#1c1c1a"] },
    { id: 4, name: "Elegant Abaya", slug: "elegant-abaya-4", category: "abayas", sizes: "XS – XXL", sizesArray: ["XS", "S", "M", "L", "XL", "XXL"], fabric: "Chiffon", color: "Dusty Rose", now: "6,490", mainImg: "/Categories/abaya/abaya4.png", altImg: "/Categories/abaya/abaya5.png", swatches: ["#E7D9C9"] },
    { id: 5, name: "Luxury Occasion Abaya", slug: "luxury-occasion-abaya-5", category: "abayas", sizes: "XS – XXL", sizesArray: ["XS", "S", "M", "L", "XL", "XXL"], fabric: "Silk Satin", color: "Olive", now: "7,490", tag: "NEW IN", mainImg: "/Categories/abaya/abaya5.png", altImg: "/Categories/abaya/abaya1.png", swatches: ["#3E4930"] },
    
    // Hijabs
    { id: 6, name: "Premium Chiffon Hijab", slug: "premium-chiffon-hijab-1", category: "hijabs", sizes: "One Size", sizesArray: ["One Size"], fabric: "Chiffon", color: "Dusty Rose", now: "2,400", tag: "Bestseller", mainImg: "/Categories/hijabs/hijab1.png", altImg: "/Categories/hijabs/hijab2.png", swatches: ["#E7D9C9"] },
    { id: 7, name: "Everyday Jersey Hijab", slug: "everyday-jersey-hijab-2", category: "hijabs", sizes: "One Size", sizesArray: ["One Size"], fabric: "Linen Blend", color: "Olive", now: "2,200", mainImg: "/Categories/hijabs/hijab2.png", altImg: "/Categories/hijabs/hijab1.png", swatches: ["#3E4930"] },
    
    // Irani Chadar
    { id: 8, name: "Classic Irani Chadar", slug: "classic-irani-chadar-1", category: "irani-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "8,990", tag: "NEW IN", mainImg: "/Categories/iranichadar/irani1.png", altImg: "/Categories/iranichadar/irani2.png", swatches: ["#1c1c1a"] },
    { id: 9, name: "Flowing Irani Chadar", slug: "flowing-irani-chadar-2", category: "irani-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "8,990", mainImg: "/Categories/iranichadar/irani2.png", altImg: "/Categories/iranichadar/irani3.png", swatches: ["#1c1c1a"] },
    { id: 10, name: "Premium Irani Chadar", slug: "premium-irani-chadar-3", category: "irani-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "9,490", mainImg: "/Categories/iranichadar/irani3.png", altImg: "/Categories/iranichadar/irani4.png", swatches: ["#1c1c1a"] },
    { id: 11, name: "Everyday Irani Chadar", slug: "everyday-irani-chadar-4", category: "irani-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "7,990", mainImg: "/Categories/iranichadar/irani4.png", altImg: "/Categories/iranichadar/irani5.png", swatches: ["#1c1c1a"] },
    { id: 12, name: "Lightweight Irani Chadar", slug: "lightweight-irani-chadar-5", category: "irani-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "8,490", mainImg: "/Categories/iranichadar/irani5.png", altImg: "/Categories/iranichadar/irani1.png", swatches: ["#1c1c1a"] },
    
    // Jilbab
    { id: 13, name: "Two Piece Jilbab", slug: "two-piece-jilbab-1", category: "jilbab", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "6,990", tag: "Bestseller", mainImg: "/Categories/jilbab/jilbab.png", altImg: "/Categories/jilbab/jilbab2.png", swatches: ["#1c1c1a"] },
    { id: 14, name: "Overhead Jilbab", slug: "overhead-jilbab-2", category: "jilbab", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Olive", now: "6,490", mainImg: "/Categories/jilbab/jilbab2.png", altImg: "/Categories/jilbab/jilbab3.png", swatches: ["#3E4930"] },
    { id: 15, name: "Premium Jilbab Set", slug: "premium-jilbab-set-3", category: "jilbab", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Dusty Rose", now: "7,490", mainImg: "/Categories/jilbab/jilbab3.png", altImg: "/Categories/jilbab/jilbab4.png", swatches: ["#E7D9C9"] },
    { id: 16, name: "Everyday Jilbab", slug: "everyday-jilbab-4", category: "jilbab", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Ivory", now: "5,990", mainImg: "/Categories/jilbab/jilbab4.png", altImg: "/Categories/jilbab/jilbab.png", swatches: ["#EFE4CC"] },
    
    // Namaz Chadar
    { id: 17, name: "Comfort Namaz Chadar", slug: "comfort-namaz-chadar-1", category: "namaz-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Linen Blend", color: "Ivory", now: "3,490", tag: "Essential", mainImg: "/Categories/namazchadar/namazchaddar.png", altImg: "/Categories/namazchadar/namazchaddar.png", swatches: ["#ffffff"] },
    
    // Round Chadar
    { id: 18, name: "Classic Round Chadar", slug: "classic-round-chadar-1", category: "round-chadar", sizes: "One Size", sizesArray: ["One Size"], fabric: "Nida Crepe", color: "Black", now: "4,490", mainImg: "/Categories/roundchadar/round1.png", altImg: "/Categories/roundchadar/round1.png", swatches: ["#1c1c1a"] }
  ];

  const { categoryId } = useParams();

  const categoryHeaders = {
    abayas: {
      title: "Abayas",
      eyebrow: "Full Coverage · XS – XXL",
      desc: "Structured yet soft, tailored generously for every body — from everyday wear to Eid mornings.",
      image: "/Categories/abaya/abaya1.png"
    },
    hijabs: {
      title: "Hijabs",
      eyebrow: "Premium Fabrics",
      desc: "Breathable and drapeable hijabs for everyday luxury.",
      image: "/Categories/hijabs/hijab1.png"
    },
    "irani-chadar": {
      title: "Irani Chadar",
      eyebrow: "Traditional Coverage",
      desc: "Elegant and flowing irani chadar made from premium nida.",
      image: "/Categories/iranichadar/irani1.png"
    },
    jilbab: {
      title: "Jilbabs",
      eyebrow: "Classic Modesty",
      desc: "Comfortable two-piece and overhead jilbabs for complete coverage.",
      image: "/Categories/jilbab/jilbab.png"
    },
    "namaz-chadar": {
      title: "Namaz Chadar",
      eyebrow: "Prayer Essentials",
      desc: "Soft, breathable cotton-blend chadar perfect for your daily prayers.",
      image: "/Categories/namazchadar/namazchaddar.png"
    },
    "round-chadar": {
      title: "Round Chadar",
      eyebrow: "Perfect Drape",
      desc: "Classic round chadar ensuring perfect coverage with premium fabric.",
      image: "/Categories/roundchadar/round1.png"
    }
  };

  const currentHeader = categoryHeaders[categoryId] || categoryHeaders.abayas;
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