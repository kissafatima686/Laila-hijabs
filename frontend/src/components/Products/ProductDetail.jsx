import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products as mainProducts } from '../../data/products';
import { CartContext } from '../../context/CartContext';
import { useContent } from '../../context/useContent';
import ProductReviews from './ProductReviews';
import './ProductDetail.css';



// Interactive "How We Do It" pillars
const howWeDoItPillars = [
  {
    id: 'dtc',
    label: 'DIRECT TO CONSUMER',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    headline: 'DIRECT TO CONSUMER',
    description: 'We eliminate traditional retail markups by designing, crafting, and shipping directly from our studio to your wardrobe, giving you fair pricing on luxury modesty.'
  },
  {
    id: 'inhouse',
    label: 'DESIGNED IN HOUSE',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.2">
        <path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4z"/>
        <path d="M6 8h12l1.5 12h-15z"/>
      </svg>
    ),
    headline: 'DESIGNED IN HOUSE',
    description: 'Every silhouette, seam, and button pattern is crafted by our specialized modesty design team in Lahore, blending timeless drape with modern elegance.'
  },
  {
    id: 'nomass',
    label: 'NO MASS PRODUCTION',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.2">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <circle cx="7" cy="12" r="2"/>
        <path d="M14 9h4v6h-4z"/>
      </svg>
    ),
    headline: 'NO MASS PRODUCTION',
    description: 'We produce in intentional, limited capsule batches. This minimizes fabric waste, reduces environmental impact, and ensures each garment receives rigorous quality control.'
  },
  {
    id: 'smallfactories',
    label: 'SUPPORTING SMALL FACTORIES',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l7-4 7 4v14"/>
        <path d="M9 10h6"/>
        <path d="M9 14h6"/>
      </svg>
    ),
    headline: 'SUPPORTING SMALL FACTORIES',
    description: 'We partner directly with ethical, family-run tailoring workshops and master artisans, supporting local communities and guaranteeing safe, fair-wage working environments.'
  },
  {
    id: 'online',
    label: 'ONLINE & CONCESSIONS',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    headline: 'ONLINE & CONCESSIONS',
    description: 'Seamless online shopping available worldwide with express courier delivery, plus pop-up concessions and flagship styling consultation sessions.'
  }
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const mainImageDefault = product ? (product.image || product.mainImage || "/hero2.png") : "/hero2.png";
  const [activeImage, setActiveImage] = useState(mainImageDefault);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("Yellow");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('conversion');

  React.useEffect(() => {
    // Fetch product
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:5000') + ''}/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProduct({ ...data, features: data.features || [] });
          setActiveImage(data.image_url || data.image || "/hero2.png");
          setSelectedColor(data.color || "Yellow");
          
          // Setup category items if bundle attributes are active
          if (data.bundle_attributes) {
             let ba = data.bundle_attributes;
             if (typeof ba === 'string') {
                 try { ba = JSON.parse(ba); } catch(e) {}
             }
             if (ba && ba.isActive && ba.items) {
                 const curColor = data.color || "Olive Green";
                 const curFabric = data.material || data.fabric || "Nida Crepe";
                 setCategoryItems(ba.items.map(item => ({
                     id: item.id || Math.random().toString(),
                     garmentType: item.name.replace('FOR ', ''),
                     size: 'S',
                     fabricType: curFabric,
                     customColor: curColor
                 })));
             }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch product detail", err);
        setLoading(false);
      });
  }, [slug]);

  // Accordion states
  const [openFabricFit, setOpenFabricFit] = useState(false);
  const [openCareAdvice, setOpenCareAdvice] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);

  // How We Do It Modal state
  const [activePillar, setActivePillar] = useState(null);

  const { getSectionContent } = useContent();
  const specsConfig = getSectionContent('products_specs_template', 'specs', []);
  const specsIsActive = getSectionContent('products_specs_template', 'isActive', true);

  const [categoryItems, setCategoryItems] = useState(() => {
    const curColor = product ? (product.color || "Olive Green") : "Olive Green";
    const curFabric = product ? (product.material || product.fabric || "Nida Crepe") : "Nida Crepe";

    const baseItems = specsConfig && specsConfig.length > 0 ? specsConfig.map(spec => {
      let gTypeOptions = Array.isArray(spec.garmentTypes) ? spec.garmentTypes : (typeof spec.garmentTypes === 'string' ? spec.garmentTypes.split(',').map(s=>({name:s.trim(), active:true})) : []);
      let fTypeOptions = Array.isArray(spec.fabricTypes) ? spec.fabricTypes : (typeof spec.fabricTypes === 'string' ? spec.fabricTypes.split(',').map(s=>({name:s.trim(), active:true})) : []);
      
      return {
        id: spec.id,
        name: spec.name,
        garmentTypeLabel: spec.garmentTypeLabel || 'GARMENT TYPE',
        garmentType: gTypeOptions.find(o => o.active)?.name || 'Abaya',
        garmentTypes: gTypeOptions,
        size: 'S',
        fabricTypeLabel: spec.fabricTypeLabel || 'FABRIC TYPE',
        fabricType: fTypeOptions.find(o => o.active)?.name || curFabric,
        fabricTypes: fTypeOptions,
        customColor: curColor,
        hasSize: spec.hasSize !== false,
        hasColor: spec.hasColor !== false,
        hasSizeGuide: spec.hasSizeGuide !== false,
        measurements: { abayaLength: '', abayaWidth: '', sleeveLength: '', sleeveWidth: '', shoulderWidth: '' }
      };
    }) : [
      { id: 'cat-abaya', name: 'FOR ABAYA', garmentType: 'Abaya', size: 'S', fabricType: curFabric, customColor: curColor, measurements: { abayaLength: '', abayaWidth: '', sleeveLength: '', sleeveWidth: '', shoulderWidth: '' }, garmentTypes: 'Abaya', fabricTypes: 'Nida Crepe, Cotton Blend Poplin', hasSize: true },
      { id: 'cat-scarf', name: 'FOR SCARF / HIJAB', garmentType: 'Scarf / Hijab', size: 'Free Size', fabricType: 'Georgette Chiffon', customColor: curColor, garmentTypes: 'Scarf / Hijab', fabricTypes: 'Georgette Chiffon, Cotton Jersey, Silk Satin', hasSize: false },
      { id: 'cat-coord', name: 'FOR CO-ORD SET', garmentType: 'Co-Ord Set', size: 'S', fabricType: 'Cotton Blend Poplin', customColor: curColor, garmentTypes: 'Co-Ord Set', fabricTypes: 'Cotton Blend Poplin', hasSize: true }
    ];
    return baseItems;
  });

  const visibleCategoryItems = React.useMemo(() => {
    if (!specsConfig || specsConfig.length === 0) return categoryItems;
    return categoryItems.filter(item => {
      const spec = specsConfig.find(s => s.id === item.id);
      if (spec && spec.active === false) return false;
      return true;
    });
  }, [categoryItems, specsConfig]);

  const [openCategoryAccordions, setOpenCategoryAccordions] = useState({});

  const toggleCategoryAccordion = (id) => {
    setOpenCategoryAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateCategoryItem = (id, field, value) => {
    setCategoryItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const updateItemMeasurement = (id, mKey, mVal) => {
    setCategoryItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          measurements: { ...item.measurements, [mKey]: mVal }
        };
      }
      return item;
    }));
  };

  // Toast feedback state
  const [wishlistToast, setWishlistToast] = useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setActiveImage(product.image || product.mainImage || "/hero2.png");
      setSelectedColor(product.color || "Yellow");
    }
  }, [slug, product]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '12px 24px', cursor: 'pointer', background: '#2A2A22', color: '#fff', border: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const thumbnails = product.thumbnails || [mainImageDefault, "/hero1.png", mainImageDefault, "/hero1.png"];
  const displayPrice = product.sale_price 
    ? `Rs. ${product.sale_price.toLocaleString()}` 
    : (typeof product.price === 'number' 
        ? `Rs. ${product.price.toLocaleString()}` 
        : product.price);
        
  const displayComparePrice = product.compare_at_price
    ? `Rs. ${product.compare_at_price.toLocaleString()}`
    : null;

  const isWishlisted = wishlistItems?.some(item => (item.id && item.id === product.id) || (item.slug && item.slug === product.slug));

  const openLightbox = (index) => {
    navigate(`/Products/${product.slug}/gallery`, { state: { thumbnails, initialIndex: index } });
  };

  const handleAddToBag = () => {
    addToCart({ 
      ...product, 
      size: selectedSize, 
      color: selectedColor, 
      categoryItems 
    });
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id || product.slug);
    } else {
      addToWishlist({ ...product, size: selectedSize, color: selectedColor });
      setWishlistToast(true);
      setTimeout(() => setWishlistToast(false), 3500);
    }
  };

  const colorSwatches = product.colorSwatches || [
    { name: product.color || "Yellow", hex: "#E5C158" },
    { name: "Nude", hex: "#C8A88B" }
  ];

  const sizes = product.sizes || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="product-page-container">
      {/* Toast Notification */}
      {wishlistToast && (
        <div className="wishlist-toast">
          <span>Item added to your Wishlist!</span>
          <Link to="/wishlist" className="toast-link">VIEW WISHLIST →</Link>
        </div>
      )}

      <div className="product-detail-grid">
        {/* Left Column - Hero & 4 Image Grid */}
        <div className="left-gallery-column">
          <div className="hero-image-wrapper" onClick={() => openLightbox(thumbnails.indexOf(activeImage) >= 0 ? thumbnails.indexOf(activeImage) : 0)} style={{ cursor: 'zoom-in' }}>
            <img src={activeImage} alt={product.name} className="hero-image" />
            <div className="circle-badge">{product.badge || "NEW IN"}</div>
          </div>

          <div className="grid-images-container">
            {thumbnails.slice(0, 4).map((img, index) => (
              <div 
                key={index} 
                className={`grid-image-box ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`${product.name} detail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info & Controls */}
        <div className="right-info-column">
          <span className="category-label">{product.category || "CO-ORD SETS"}</span>
          <h1 className="product-main-title">{(product.name || "").toUpperCase()}</h1>
          <p className="product-price" style={{ display: "flex", gap: "10px", alignItems: "center" }}>{displayPrice} {displayComparePrice && <span style={{ textDecoration: "line-through", color: "#888", fontSize: "0.8em" }}>{displayComparePrice}</span>}</p>

          <p className="product-description">{product.description}</p>
          
          {product.features && product.features.length > 0 && (
            <ul className="prod-features-list">
              {product.features.map((ft, i) => (
                <li key={i}>{ft}</li>
              ))}
            </ul>
          )}

          <p className="prod-sku">SKU: {product.id} • {product.category}</p>

          <div style={{ marginTop: '15px', color: product.stock_quantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock - Ready to ship!` : 'Out of stock'}
          </div>

          {/* Category Details FAQ Accordions Block */}
          {(product && product.bundle_attributes && (typeof product.bundle_attributes === 'string' ? JSON.parse(product.bundle_attributes) : product.bundle_attributes).isActive && specsIsActive) && (<div className="product-category-accordions-container">
            <div className="category-accordions-header">
              <span className="specs-title">CATEGORY SPECIFICATIONS & CUSTOMIZATION</span>
            </div>

            {/* Accordion list for each category */}
            <div className="category-accordions-list">
              {visibleCategoryItems.map((item) => {
                const isScarf = item.garmentType.toLowerCase().includes('scarf') || item.garmentType.toLowerCase().includes('hijab');
                const isOpen = Boolean(openCategoryAccordions[item.id]);

                return (
                  <div key={item.id} className={`category-accordion-item ${isOpen ? 'open' : ''}`}>
                    <div className="category-accordion-header-bar">
                      <button 
                        type="button"
                        className="category-accordion-trigger"
                        onClick={() => toggleCategoryAccordion(item.id)}
                      >
                        <span className="category-accordion-title">
                          {item.name.toUpperCase()}
                        </span>
                        <span className="category-accordion-chevron">{isOpen ? '∧' : '∨'}</span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="category-accordion-body">
                        {/* Garment & Fabric Type Row */}
                        <div className="custom-form-row">
                          <div className="custom-form-field">
                            <label className="custom-field-label">{item.garmentTypeLabel || 'GARMENT TYPE'} *</label>
                            <select 
                              className="custom-field-select"
                              value={item.garmentType}
                              onChange={(e) => updateCategoryItem(item.id, 'garmentType', e.target.value)}
                            >
                              {(item.garmentTypes || []).filter(o => o.active).map((opt, i) => (
                                <option key={i} value={opt.name}>{opt.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="custom-form-field">
                            <label className="custom-field-label">{item.fabricTypeLabel || 'FABRIC TYPE'} *</label>
                            <select 
                              className="custom-field-select"
                              value={item.fabricType}
                              onChange={(e) => updateCategoryItem(item.id, 'fabricType', e.target.value)}
                            >
                              {(item.fabricTypes || []).filter(o => o.active).map((opt, i) => (
                                <option key={i} value={opt.name}>{opt.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Color Selector matching Image 2 */}
                        {item.hasColor !== false && (
                          <div className="color-selection-block" style={{ marginBottom: '20px' }}>
                            <div className="color-header" style={{ marginBottom: '8px' }}>
                              <span className="block-label" style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px' }}>COLOUR:</span>
                              <span className="selected-color-name" style={{ marginLeft: '10px', color: '#888', fontSize: '11px', letterSpacing: '1px' }}>{(item.customColor || selectedColor || "").toUpperCase()}</span>
                            </div>
                            <div className="custom-color-input-wrapper">
                              <input 
                                type="text"
                                className="custom-field-input"
                                style={{ width: '100%', padding: '10px', fontSize: '13px', backgroundColor: '#e9e3d5', border: '1px solid #d4cbb8', borderRadius: '4px', outline: 'none' }}
                                placeholder="Enter colour..."
                                value={item.customColor || selectedColor || ""}
                                onChange={(e) => {
                                  updateCategoryItem(item.id, 'customColor', e.target.value);
                                  setSelectedColor(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Size Selector matching Image 2 */}
                        {item.hasSize !== false && (
                          <div className="size-selection-block">
                            <div className="size-header-line">
                              <span className="block-label">SELECT SIZE</span>
                              {item.hasSizeGuide !== false && (
                                <Link 
                                  to="/size-guide"
                                  className="size-guide-link"
                                >
                                  SIZE GUIDE
                                </Link>
                              )}
                            </div>

                            <div className="size-boxes-grid">
                              {product.sizes && product.sizes.map((size) => {
                                const isOutOfStock = size === "XXS";
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    className={`size-box ${item.size === size ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                                    onClick={() => {
                                      updateCategoryItem(item.id, 'size', size);
                                      setSelectedSize(size);
                                    }}
                                  >
                                    {isOutOfStock && (
                                      <svg className="notify-mail-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                      </svg>
                                    )}
                                    <span>{size}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Standalone Color & Size Selector Block Above Cart Button */}
          {(!product || !product.bundle_attributes || !(typeof product.bundle_attributes === 'string' ? JSON.parse(product.bundle_attributes) : product.bundle_attributes).isActive) && (<div className="product-quick-selection-block" style={{ margin: '20px 0 24px 0' }}>
            {/* Color Selector */}
            <div className="color-selection-block">
              <div className="color-header">
                <span className="block-label">COLOUR:</span>
                <span className="selected-color-name">{(selectedColor || "").toUpperCase()}</span>
              </div>

              <div className="swatches-row">
                {product.variants && product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`color-swatch-circle ${selectedColor === variant.name ? 'active' : ''}`}
                    style={{ backgroundColor: variant.hex }}
                    onClick={() => handleColorChange(variant)}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="size-selection-block">
              <div className="size-header-line">
                <span className="block-label">SELECT SIZE</span>
                                <Link 
                                  to="/size-guide"
                                  className="size-guide-link"
                                >
                                  SIZE GUIDE
                                </Link>
              </div>

              <div className="size-boxes-grid">
                {product.sizes && product.sizes.map((size) => {
                  const isOutOfStock = size === "XXS";
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`size-box ${selectedSize === size ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {isOutOfStock && (
                        <svg className="notify-mail-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      )}
                      <span>{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Action Buttons */}
          <div className="cta-buttons-group">
            <button className="add-to-bag-btn" onClick={handleAddToBag}>
              ADD TO BAG
            </button>

            <button 
              type="button" 
              className={`add-to-wishlist-btn ${isWishlisted ? 'is-wishlisted' : ''}`}
              onClick={handleToggleWishlist}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#2A2A22" : "none"} stroke="#2A2A22" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{isWishlisted ? 'IN WISHLIST' : 'ADD TO WISHLIST'}</span>
            </button>
          </div>

          {/* Collapsible Accordions */}
          <div className="product-accordions">
            {/* Fabric & Fit */}
            <div className="accordion-item">
              <button 
                type="button" 
                className="accordion-header"
                onClick={() => setOpenFabricFit(!openFabricFit)}
              >
                <span>FABRIC & FIT</span>
                <span className="accordion-icon">{openFabricFit ? '—' : '∨'}</span>
              </button>
              {openFabricFit && (
                <div className="accordion-content">
                  <div className="fit-scale-container">
                    <span className="fit-label-title">FIT</span>
                    <div className="fit-line-scale">
                      <div className="scale-point">
                        <div className={`circle-node ${product.fitType === 'Slim Fit' ? 'active-node' : ''}`} />
                        <span className="node-text">Slim Fit</span>
                      </div>
                      <div className="scale-point">
                        <div className={`circle-node ${product.fitType === 'Regular Fit' || !product.fitType ? 'active-node' : ''}`} />
                        <span className="node-text">Regular Fit</span>
                      </div>
                      <div className="scale-point">
                        <div className={`circle-node ${product.fitType === 'Loose Fit' ? 'active-node' : ''}`} />
                        <span className="node-text">Loose Fit</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Materials & Care Advice */}
            <div className="accordion-item">
              <button 
                type="button" 
                className="accordion-header"
                onClick={() => setOpenCareAdvice(!openCareAdvice)}
              >
                <span>MATERIALS & CARE ADVICE</span>
                <span className="accordion-icon">{openCareAdvice ? '—' : '∨'}</span>
              </button>
              {openCareAdvice && (
                <div className="accordion-content">
                  <p>100% Premium Cotton Blend Poplin. Machine wash cold at 30°C on delicate cycle. Do not tumble dry. Line dry in shade. Cool iron on reverse.</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="accordion-item">
              <button 
                type="button" 
                className="accordion-header"
                onClick={() => setOpenDelivery(!openDelivery)}
              >
                <span>DELIVERY & RETURNS</span>
                <span className="accordion-icon">{openDelivery ? '—' : '∨'}</span>
              </button>
              {openDelivery && (
                <div className="accordion-content">
                  <p>Standard delivery takes 3-5 business days. Free delivery on orders over Rs. 5,000. Easy 14-day paperless returns and size exchanges.</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Return Badges */}
          <div className="delivery-badges-section">
            <div className="badge-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.6">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span>FREE DELIVERY ON ALL ORDERS OVER RS. 5,000</span>
            </div>
            <div className="badge-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.6">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>EASY PAPERLESS RETURNS & FREE EXCHANGES</span>
            </div>
          </div>
        </div>

        {/* Size Chart Modal (Anchored to viewport via Portal) */}
        {showSizeChart && createPortal(
          <div className="size-chart-overlay" onClick={() => setShowSizeChart(false)}>
            <div className="size-chart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="size-chart-header">
                <div>
                  <h3>SIZE CHART & FIT GUIDE</h3>
                  <p className="size-chart-subtitle">Find your ideal size and measurements</p>
                </div>
                <button 
                  type="button" 
                  className="close-modal-icon" 
                  onClick={() => setShowSizeChart(false)}
                >
                  ✕
                </button>
              </div>

              <div className="size-chart-tabs">
                <button 
                  className={`chart-tab ${activeChartTab === 'conversion' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('conversion')}
                >
                  Size Conversion
                </button>
                <button 
                  className={`chart-tab ${activeChartTab === 'length' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('length')}
                >
                  Length & Height
                </button>
                <button 
                  className={`chart-tab ${activeChartTab === 'measure' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('measure')}
                >
                  How to Measure
                </button>
              </div>

              <div className="size-chart-content">
                {activeChartTab === 'conversion' && (
                  <div className="chart-panel">
                    <div className="table-responsive">
                      <table className="size-guide-table">
                        <thead>
                          <tr>
                            <th>SIZE</th>
                            <th>XXS</th>
                            <th>XS</th>
                            <th>S</th>
                            <th>M</th>
                            <th>L</th>
                            <th>XL</th>
                            <th>XXL</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>UK SIZE</strong></td>
                            <td>4-6</td>
                            <td>6-8</td>
                            <td>10-12</td>
                            <td>14-16</td>
                            <td>18-20</td>
                            <td>22-24</td>
                            <td>24-26</td>
                          </tr>
                          <tr>
                            <td><strong>US SIZE</strong></td>
                            <td>0-2</td>
                            <td>2-4</td>
                            <td>6-8</td>
                            <td>10-12</td>
                            <td>14-16</td>
                            <td>18-20</td>
                            <td>20-22</td>
                          </tr>
                          <tr>
                            <td><strong>EU SIZE</strong></td>
                            <td>32-34</td>
                            <td>34-36</td>
                            <td>38-40</td>
                            <td>42-44</td>
                            <td>46-48</td>
                            <td>50-52</td>
                            <td>52-54</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeChartTab === 'length' && (
                  <div className="chart-panel">
                    <p className="chart-intro">Garment length is measured from top shoulder to bottom hemline:</p>
                    <div className="table-responsive">
                      <table className="size-guide-table">
                        <thead>
                          <tr>
                            <th>LENGTH (INCHES)</th>
                            <th>52"</th>
                            <th>54"</th>
                            <th>56"</th>
                            <th>58"</th>
                            <th>62"</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>RECOMMENDED HEIGHT</strong></td>
                            <td>4'11" - 5'2"</td>
                            <td>5'2" - 5'4"</td>
                            <td>5'4" - 5'6"</td>
                            <td>5'6" - 5'8"</td>
                            <td>5'9" - 6'2"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeChartTab === 'measure' && (
                  <div className="chart-panel measure-guide-panel">
                    <div className="measure-item">
                      <span className="measure-badge">1</span>
                      <div>
                        <strong>Full Height / Garment Length</strong>
                        <p>Measure standing upright from high shoulder point down to desired ankle length.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* CUSTOMER REVIEWS & PARCEL UNBOXING SECTION */}
      <ProductReviews product={product} />

      {/* HOW WE DO IT Bottom Section (Bg White & Workable) */}
      <div className="how-we-do-it-section">
        <h2 className="how-we-do-it-title">HOW WE DO IT</h2>
        <div className="how-we-do-it-grid">
          {howWeDoItPillars.map((pillar) => (
            <div 
              key={pillar.id} 
              className="feature-item workable"
              onClick={() => setActivePillar(pillar)}
              title={`Click to learn more about ${pillar.label}`}
            >
              <div className="feature-icon">{pillar.icon}</div>
              <span className="feature-label">{pillar.label}</span>
              <span className="learn-more-link">Learn More →</span>
            </div>
          ))}
        </div>

        {/* Pillar Detail Modal (Anchored to viewport via Portal) */}
        {activePillar && createPortal(
          <div className="pillar-section-overlay" onClick={() => setActivePillar(null)}>
            <div className="pillar-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="pillar-modal-header">
                <div className="pillar-header-icon">{activePillar.icon}</div>
                <button type="button" className="close-modal-icon" onClick={() => setActivePillar(null)}>✕</button>
              </div>
              <h3 className="pillar-modal-title">{activePillar.headline}</h3>
              <p className="pillar-modal-text">{activePillar.description}</p>
              <div className="pillar-modal-actions">
                <Link to="/gift-card" onClick={() => setActivePillar(null)} className="pillar-action-btn">
                  OUR STORY
                </Link>
                <button type="button" onClick={() => setActivePillar(null)} className="pillar-close-btn">
                  CLOSE
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
};

export default ProductDetail;