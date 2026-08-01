import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ─── SVG Icon Components ──────────────────────────────────────────────────────
const Ico = ({ path, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  slider: 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 0-2 2h-3',
  products: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  categories: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  blogs: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
  testimonials: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  faqs: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  sizeGuide: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  reviews: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  orders: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  customOrders: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  affiliates: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  messages: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  offers: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  locations: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
  navbar: 'M3 12h18M3 6h18M3 18h18',
  footer: 'M3 5v14M21 5v14M3 12h18',
  section: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  settings: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  image: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  announce: 'M8 12h8M12 8v8',
  valueStrip: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  trending: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  whatsapp: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  video: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z'
};

// ─── Single Nav Link ──────────────────────────────────────────────────────────
const SideLink = ({ to, label, icon, indent = false, deepIndent = false }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: deepIndent ? '7px 12px 7px 34px' : (indent ? '8px 12px 8px 24px' : '10px 14px'),
      borderRadius: '6px',
      fontSize: (indent || deepIndent) ? '12.5px' : '13px',
      fontWeight: isActive ? '700' : '400',
      color: isActive ? '#F6F1E3' : '#E7D9C9',
      backgroundColor: isActive ? '#B8935B' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.15s ease',
      lineHeight: '1.2',
      marginLeft: deepIndent ? '6px' : (indent ? '2px' : '0')
    })}
  >
    {icon && <Ico path={ICONS[icon] || ICONS.section} size={(indent || deepIndent) ? 13 : 15} />}
    <span>{label}</span>
  </NavLink>
);

// ─── Collapsible Group ────────────────────────────────────────────────────────
const ColGroup = ({ label, icon, children, defaultOpen = false, indent = false }) => {
  const location = useLocation();

  const checkChildActive = (nodes) => {
    return React.Children.toArray(nodes).some(child => {
      if (!child) return false;
      if (child.props?.to && location.pathname.startsWith(child.props.to)) return true;
      if (child.props?.children) return checkChildActive(child.props.children);
      return false;
    });
  };

  const hasActive = checkChildActive(children);
  const [open, setOpen] = useState(defaultOpen || hasActive);

  return (
    <div style={{ marginBottom: '2px', marginLeft: indent ? '4px' : '0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: indent ? '7px 10px 7px 18px' : '9px 14px', background: 'none', border: 'none',
          color: '#E7D9C9', fontSize: indent ? '12px' : '13px', fontWeight: '600',
          cursor: 'pointer', borderRadius: '6px', gap: '8px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <Ico path={ICONS[icon] || ICONS.section} size={indent ? 13 : 15} />}
          {label}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '2px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────
const Hr = () => <div style={{ height: '1px', backgroundColor: 'rgba(184, 147, 91, 0.25)', margin: '10px 6px' }} />;

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = () => (
  <aside style={{
    width: '240px', minWidth: '240px',
    backgroundColor: '#3E4930', color: '#F6F1E3',
    height: '100vh', position: 'sticky', top: 0,
    padding: '16px 10px',
    display: 'flex', flexDirection: 'column',
    boxSizing: 'border-box', zIndex: 100, overflowY: 'auto',
    borderRight: '1px solid #B8935B'
  }}>

    {/* Top Logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '4px 8px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        backgroundColor: '#F6F1E3', color: '#3E4930',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '800', fontSize: '15px', flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1.5px solid #B8935B'
      }}>
        LH
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '0.5px', color: '#F6F1E3' }}>Laila Admin</span>
        <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600' }}>Control Panel</span>
      </div>
    </div>

    <SideLink to="/dashboard" label="Dashboard" icon="dashboard" />
    <SideLink to="/admin-users" label="Admin Users & Roles" icon="users" />

    <Hr />

    {/* HERO PAGE & NAVIGATION */}
    <ColGroup label="Hero Page" icon="slider" defaultOpen={true}>
      <ColGroup label="Nav Bar Links" icon="navbar" indent defaultOpen={false}>
        <SideLink to="/sections/navbar_settings" label="Branding & Logo" icon="section" deepIndent />
        <SideLink to="/navbar-links" label="Navbar Links Manager" icon="navbar" deepIndent />
        <SideLink to="/categories-mega-menu" label="Categories Mega Menu" icon="categories" deepIndent />
      </ColGroup>

      <ColGroup label="Header Utilities" icon="settings" indent defaultOpen={false}>
        <SideLink to="/search-bar-keywords" label="Search Bar & Keywords" icon="section" deepIndent />
        <SideLink to="/customer-accounts-manager" label="Customer Accounts" icon="users" deepIndent />
        <SideLink to="/wishlist-manager" label="Wishlist Settings" icon="section" deepIndent />
        <SideLink to="/cart-manager" label="Cart Page Settings" icon="orders" deepIndent />
        <SideLink to="/checkout-manager" label="Checkout Page Settings" icon="orders" deepIndent />
        <SideLink to="/payment-manager" label="Payment Settings" icon="orders" deepIndent />
      </ColGroup>

      <ColGroup label="Hero and Banners" icon="image" indent defaultOpen={false}>
        <SideLink to="/announcement-bar-manager" label="Announcement Bar" icon="announce" deepIndent />
        <SideLink to="/hero-sliders" label="Hero Sliders" icon="slider" deepIndent />
        <SideLink to="/review-banner-manager" label="Review Banner" icon="reviews" deepIndent />
      </ColGroup>

      <ColGroup label="Content Section" icon="section" indent defaultOpen={false}>
        <SideLink to="/value-features-strip-manager" label="Value Features Strip" icon="valueStrip" deepIndent />
        <SideLink to="/interactive-value-slider-manager" label="Interactive Value Slider" icon="slider" deepIndent />
      </ColGroup>

      <ColGroup label="Dynamic Show Case" icon="trending" indent defaultOpen={false}>
        <SideLink to="/testimonials" label="Customer Testimonials" icon="testimonials" deepIndent />
        <SideLink to="/trending-manager" label="Trending Products" icon="trending" deepIndent />
        <SideLink to="/social-media-manager" label="Social Media Reels" icon="video" deepIndent />
        <SideLink to="/featured-collections-manager" label="Featured Collections" icon="categories" deepIndent />
        <SideLink to="/sections/home_whatsapp_float" label="Floating WhatsApp" icon="whatsapp" deepIndent />
      </ColGroup>
    </ColGroup>

    <Hr />

    {/* OFFERS & PROMOTIONS */}
    <ColGroup label="Offers and Promotions" icon="offers" defaultOpen={false}>
      <SideLink to="/offers" label="Offers and Promos Manager" icon="offers" indent />
      <SideLink to="/offers/bundles" label="Offers Bundles Page" icon="offers" indent />
    </ColGroup>

    <Hr />

    {/* PRODUCTS & CATALOG */}
    <ColGroup label="Products and Catalog" icon="products" defaultOpen={false}>
      <SideLink to="/products" label="Product Inventory" icon="products" indent />
      <SideLink to="/featured-collections-manager" label="Product Categories" icon="categories" indent />
      <ColGroup label="Product Elements" icon="section" indent defaultOpen={false}>
        <SideLink to="/product-reviews" label="Customer Reviews" icon="reviews" deepIndent />
        <SideLink to="/sections/products_specs_template" label="Product Specs" icon="section" deepIndent />
        <SideLink to="/size-guide" label="Size Guide Chart" icon="sizeGuide" deepIndent />
        <SideLink to="/sections/products_filters_config" label="Color & Filters" icon="section" deepIndent />
        <SideLink to="/filters/fabrics" label="Fabric Options" icon="section" deepIndent />
        <SideLink to="/filters/sizes" label="Size Options" icon="section" deepIndent />
        <SideLink to="/filters/colors" label="Color Options" icon="section" deepIndent />
        <SideLink to="/filters/prices" label="Price Ranges" icon="section" deepIndent />
        <SideLink to="/faqs/product" label="Product FAQs" icon="faqs" deepIndent />
        <SideLink to="/how-we-do-it" label="Process & How We Do It" icon="section" deepIndent />
      </ColGroup>
    </ColGroup>

    <Hr />

    {/* CUSTOM ORDER DESIGN */}
    <ColGroup label="Custom Order Design" icon="customOrders" defaultOpen={false}>
      <SideLink to="/sections/custom_orders_settings" label="Custom Order Page" icon="section" indent />
      <SideLink to="/custom-orders" label="Custom Order Requests" icon="customOrders" indent />
    </ColGroup>

    <Hr />

    {/* BLOGS & CONTENT */}
    <ColGroup label="Blogs and Content" icon="blogs" defaultOpen={false}>
      <SideLink to="/sections/blogs_page_header" label="Blogs Page" icon="blogs" indent />
      <SideLink to="/blogs" label="Blogs Detail Page" icon="section" indent />
    </ColGroup>

    <Hr />

    {/* AFFILIATE PROGRAM */}
    <ColGroup label="Affiliate Program" icon="affiliates" defaultOpen={false}>
      <SideLink to="/sections/affiliate_program_settings" label="Program Info & Banners" icon="section" indent />
      <SideLink to="/affiliates" label="Affiliate Applications" icon="affiliates" indent />
      <SideLink to="/approved-affiliates" label="Approved Affiliates" icon="affiliates" indent />
      <SideLink to="/commissions" label="Commissions" icon="orders" indent />
      <SideLink to="/payouts" label="Payouts" icon="orders" indent />
    </ColGroup>

    <Hr />

    {/* ABOUT OUR BRAND */}
    <ColGroup label="About Our Brand" icon="section" defaultOpen={false}>
      <SideLink to="/brand-overview" label="Brand Overview & Story" icon="section" indent />
      <SideLink to="/visit-us-slider" label="Visit Us Gallery Slider" icon="image" indent />
      <SideLink to="/location-details" label="Maps, Hours & Details" icon="section" indent />
    </ColGroup>

    <Hr />

    <SideLink to="/footer-manager" label="Footer" icon="footer" />
    <SideLink to="/orders" label="Customer Orders" icon="orders" />
    <SideLink to="/messages" label="Customer Form Messages" icon="messages" />
    <SideLink to="/settings" label="Settings" icon="settings" />
  </aside>
);

export default Sidebar;
