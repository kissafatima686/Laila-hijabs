import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products as mainProducts } from '../../data/products';
import { CartContext } from '../../context/CartContext';
import ProductReviews from './ProductReviews';
import './ProductDetail.css';

// Unified product database including detail fields
const productDatabase = [
  {
    id: 101,
    slug: "lamia-open-kaftan-set",
    category: "CO-ORD SETS",
    name: "LAMIA OPEN KAFTAN SET",
    price: 9900,
    description: "Two-piece kaftan set with an inner layer and flowing open kaftan. Highlights a beautiful drape and structure perfect for any occasion.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Model is 5'7, UK 8-10 and wears size S 58",
      "Size options",
      "Burgundy colour",
      "Premium Nida-silk fabric",
      "Stand collar",
      "Concealed button fastening",
      "Feature self-fabric buttons",
      "Wide leg trousers",
      "Side pockets",
      "Sold as a set"
    ],
    color: "Burgundy",
    colorSwatches: [
      { name: "Burgundy", hex: "#722F37" },
      { name: "Olive", hex: "#5C6B44" },
      { name: "Ivory", hex: "#F5F2EA" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "NEW IN",
    fitType: "Regular Fit"
  },
  {
    id: 102,
    slug: "structured-day-abaya",
    category: "ABAYAS",
    name: "STRUCTURED DAY ABAYA",
    price: 5990,
    description: "Tailored structured abaya designed for daily comfort and elegant modesty.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Model is 5'8 and wears size S 56",
      "Relaxed fit",
      "Olive colour",
      "Breathable Nida crepe fabric",
      "Stand collar",
      "Concealed button fastening",
      "Side pocket details",
      "Single breasted closure"
    ],
    color: "Olive",
    colorSwatches: [
      { name: "Olive", hex: "#5C6B44" },
      { name: "Black", hex: "#222222" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "BEST SELLER",
    fitType: "Regular Fit"
  },
  {
    id: 103,
    slug: "ivory-chiffon-abaya",
    category: "ABAYAS",
    name: "IVORY CHIFFON ABAYA",
    price: 6490,
    description: "Ethereal lightweight chiffon abaya with full interior lining.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Model is 5'7, UK 8-10 and wears size S",
      "Georgette chiffon with smooth lining",
      "Ivory colour",
      "Elegant cuff buttons",
      "Flowing silhouette",
      "Lightweight feel"
    ],
    color: "Ivory",
    colorSwatches: [
      { name: "Ivory", hex: "#F5F2EA" },
      { name: "Dusty Rose", hex: "#D4A5A5" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "NEW IN",
    fitType: "Loose Fit"
  },
  {
    id: 104,
    slug: "gold-trim-eid-abaya",
    category: "EID COLLECTION",
    name: "GOLD-TRIM EID ABAYA",
    price: 7490,
    description: "Luxury festive abaya featuring delicate gold-trim borders on sleeves and hem.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Gold trim accents",
      "Satin blend sheen",
      "Olive colour",
      "Perfect for Eid morning",
      "Includes self-tie belt"
    ],
    color: "Olive",
    colorSwatches: [
      { name: "Olive", hex: "#5C6B44" },
      { name: "Burgundy", hex: "#722F37" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "EXCLUSIVE",
    fitType: "Regular Fit"
  },
  {
    id: 105,
    slug: "dusty-rose-open-abaya",
    category: "ABAYAS",
    name: "DUSTY ROSE OPEN ABAYA",
    price: 6890,
    description: "An elegant open abaya set in a beautiful blush rose shade.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Linen blend comfort",
      "Open front look",
      "Dusty Rose colour",
      "Wide sleeve detail"
    ],
    color: "Dusty Rose",
    colorSwatches: [
      { name: "Dusty Rose", hex: "#D4A5A5" },
      { name: "Sage", hex: "#9CAF88" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "NEW IN",
    fitType: "Loose Fit"
  },
  {
    id: 106,
    slug: "classic-black-abaya",
    category: "ABAYAS",
    name: "CLASSIC BLACK ABAYA",
    price: 5490,
    description: "The essential timeless black abaya for everyday modest style.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Nida fabric quality",
      "Deep black tone",
      "Easy maintenance",
      "Side pockets"
    ],
    color: "Black",
    colorSwatches: [
      { name: "Black", hex: "#222222" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    badge: "ESSENTIAL",
    fitType: "Regular Fit"
  },
  {
    id: 107,
    slug: "everyday-comfort-abaya",
    category: "ABAYAS",
    name: "EVERYDAY COMFORT ABAYA",
    price: 4990,
    description: "Ultra-breathable linen-blend abaya crafted for ease and versatility.",
    image: "/hero2.png",
    thumbnails: ["/hero2.png", "/hero1.png", "/hero2.png", "/hero1.png"],
    features: [
      "Linen fabric blend",
      "Comfortable wide sleeve",
      "Brand label details",
      "Side slit hem"
    ],
    color: "Ivory",
    colorSwatches: [
      { name: "Ivory", hex: "#F5F2EA" },
      { name: "Olive", hex: "#5C6B44" }
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    fitType: "Loose Fit"
  },
  ...mainProducts
];

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

  const product = productDatabase.find((p) => p.slug === slug);

  const mainImageDefault = product ? (product.image || product.mainImage || "/hero2.png") : "/hero2.png";
  const [activeImage, setActiveImage] = useState(mainImageDefault);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState(product ? (product.color || "Yellow") : "Yellow");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('conversion');

  // Accordion states
  const [openFabricFit, setOpenFabricFit] = useState(false);
  const [openCareAdvice, setOpenCareAdvice] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);

  // How We Do It Modal state
  const [activePillar, setActivePillar] = useState(null);

  const [categoryItems, setCategoryItems] = useState(() => {
    const curColor = product ? (product.color || "Olive Green") : "Olive Green";
    const curFabric = product ? (product.material || product.fabric || "Nida Crepe") : "Nida Crepe";

    return [
      { id: 'cat-abaya', garmentType: 'Abaya', size: 'S', fabricType: curFabric, customColor: curColor },
      { id: 'cat-scarf', garmentType: 'Scarf / Hijab', size: 'Free Size', fabricType: 'Georgette Chiffon', customColor: curColor },
      { id: 'cat-coord', garmentType: 'Co-Ord Set', size: 'S', fabricType: 'Cotton Blend Poplin', customColor: curColor },
      { id: 'cat-irani', garmentType: 'Irani Chadar', size: 'S', fabricType: 'Lightweight Nida Fabric', customColor: curColor },
      { id: 'cat-jilbab', garmentType: 'Jilbab', size: 'S', fabricType: 'Soft Nida Silk Blend', customColor: curColor },
      { id: 'cat-namaz', garmentType: 'Namaz Chadar', size: 'S', fabricType: '100% Soft Cotton', customColor: curColor },
      { id: 'cat-round', garmentType: 'Round Chadar', size: 'S', fabricType: 'Premium Nida Fabric', customColor: curColor }
    ];
  });

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
  const features = product.features || [
    `Model is 5'7, UK 8-10 and wears size ${selectedSize}`,
    "Size options",
    `${product.color || 'Yellow'} colour`,
    product.material || "Cotton blend poplin",
    "Stand collar",
    "Concealed button fastening",
    "Utility-inspired pockets",
    "Self-tie waist belt",
    "Wide leg trousers",
    "Side pockets",
    "Sold as a set"
  ];
  const sizes = product.sizes || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const displayPrice = typeof product.price === 'number' 
    ? `Rs. ${product.price.toLocaleString()}` 
    : product.price;

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

  const getProductFabric = (prod) => {
    if (prod.material) return prod.material;
    if (prod.fabric) return prod.fabric;
    const cat = (prod.category || '').toLowerCase();
    if (cat.includes('hijab') || cat.includes('scarf')) return "Premium Georgette Chiffon";
    if (cat.includes('abaya')) return "Breathable Nida Crepe";
    if (cat.includes('irani')) return "Lightweight Nida Fabric";
    if (cat.includes('jilbab')) return "Soft Nida Silk Blend";
    if (cat.includes('namaz')) return "100% Breathable Soft Cotton";
    if (cat.includes('round')) return "Classic Nida Crepe";
    return "Cotton & Silk Blend";
  };

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
          <p className="product-price">{displayPrice}</p>

          <p className="product-description">{product.description}</p>

          {/* Category Details FAQ Accordions Block */}
          <div className="product-category-accordions-container">
            <div className="category-accordions-header">
              <span className="specs-title">CATEGORY SPECIFICATIONS & CUSTOMIZATION</span>
            </div>

            {/* Accordion list for each category */}
            <div className="category-accordions-list">
              {categoryItems.map((item) => {
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
                          FOR {item.garmentType.toUpperCase()}
                        </span>
                        <span className="category-accordion-chevron">{isOpen ? '∧' : '∨'}</span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="category-accordion-body">
                        {/* Garment & Fabric Type Row */}
                        <div className="custom-form-row">
                          <div className="custom-form-field">
                            <label className="custom-field-label">GARMENT TYPE *</label>
                            <select 
                              className="custom-field-select"
                              value={item.garmentType}
                              onChange={(e) => updateCategoryItem(item.id, 'garmentType', e.target.value)}
                            >
                              <option value="Abaya">Abaya</option>
                              <option value="Scarf / Hijab">Scarf / Hijab</option>
                              <option value="Co-Ord Set">Co-Ord Set</option>
                              <option value="Irani Chadar">Irani Chadar</option>
                              <option value="Jilbab">Jilbab</option>
                              <option value="Namaz Chadar">Namaz Chadar</option>
                              <option value="Round Chadar">Round Chadar</option>
                            </select>
                          </div>

                          <div className="custom-form-field">
                            <label className="custom-field-label">FABRIC TYPE *</label>
                            <select 
                              className="custom-field-select"
                              value={item.fabricType}
                              onChange={(e) => updateCategoryItem(item.id, 'fabricType', e.target.value)}
                            >
                              <option value="Nida Crepe">Nida Crepe</option>
                              <option value="Georgette Chiffon">Georgette Chiffon</option>
                              <option value="Cotton Jersey">Cotton Jersey</option>
                              <option value="Silk Satin">Silk Satin</option>
                              <option value="Cotton Blend Poplin">Cotton Blend Poplin</option>
                              <option value="Linen Blend">Linen Blend</option>
                              <option value="Soft Cotton">Soft Cotton</option>
                            </select>
                          </div>
                        </div>

                        {/* Color Selector matching Image 2 */}
                        <div className="color-selection-block">
                          <div className="color-header">
                            <span className="block-label">COLOUR:</span>
                            <span className="selected-color-name">{(item.customColor || selectedColor || "").toUpperCase()}</span>
                          </div>
                          <div className="swatches-row">
                            {colorSwatches.map((swatch, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`color-swatch-circle ${(item.customColor || selectedColor) === swatch.name ? 'active' : ''}`}
                                style={{ backgroundColor: swatch.hex }}
                                onClick={() => {
                                  updateCategoryItem(item.id, 'customColor', swatch.name);
                                  setSelectedColor(swatch.name);
                                }}
                                title={swatch.name}
                              />
                            ))}
                            <div className="custom-color-input-wrapper" style={{ marginLeft: '12px', flex: 1 }}>
                              <input 
                                type="text"
                                className="custom-field-input"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                placeholder="Or enter custom color name..."
                                value={item.customColor}
                                onChange={(e) => {
                                  updateCategoryItem(item.id, 'customColor', e.target.value);
                                  setSelectedColor(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Size Selector matching Image 2 */}
                        {!isScarf && (
                          <div className="size-selection-block">
                            <div className="size-header-line">
                              <span className="block-label">SELECT SIZE</span>
                              <button 
                                type="button" 
                                className="size-guide-link"
                                onClick={() => setShowSizeChart(true)}
                              >
                                SIZE GUIDE
                              </button>
                            </div>

                            <div className="size-boxes-grid">
                              {sizes.map((size) => {
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

          {/* Standalone Color & Size Selector Block Above Cart Button */}
          <div className="product-quick-selection-block" style={{ margin: '20px 0 24px 0' }}>
            {/* Color Selector */}
            <div className="color-selection-block">
              <div className="color-header">
                <span className="block-label">COLOUR:</span>
                <span className="selected-color-name">{(selectedColor || "").toUpperCase()}</span>
              </div>
              <div className="swatches-row">
                {colorSwatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`color-swatch-circle ${selectedColor === swatch.name ? 'active' : ''}`}
                    style={{ backgroundColor: swatch.hex }}
                    onClick={() => setSelectedColor(swatch.name)}
                    title={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="size-selection-block">
              <div className="size-header-line">
                <span className="block-label">SELECT SIZE</span>
                <button 
                  type="button" 
                  className="size-guide-link"
                  onClick={() => setShowSizeChart(true)}
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="size-boxes-grid">
                {sizes.map((size) => {
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
                <Link to="/our-story" onClick={() => setActivePillar(null)} className="pillar-action-btn">
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