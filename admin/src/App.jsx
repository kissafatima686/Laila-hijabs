import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/useAuth';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import GenericModulePage from './pages/GenericModulePage';
import SectionEditorPage from './pages/SectionEditorPage';
import ProductsList from './pages/products/ProductsList';
import OrdersList from './pages/orders/OrdersList';
import Settings from './pages/Settings';
import TestimonialsPage from './pages/TestimonialsPage';
import FAQsPage from './pages/FAQsPage';
import SizeGuidePage from './pages/SizeGuidePage';
import ProductReviewsPage from './pages/ProductReviewsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import FooterManagerPage from './pages/FooterManagerPage';
import './App.css';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ── MAIN ──────────────────────────────────────────────── */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-users" element={<AdminUsersPage />} />
          <Route path="/sliders" element={<GenericModulePage moduleKey="sliders" title="Sliders" description="Homepage hero slider images, titles, subtitles, and links." />} />

          {/* ── HOME PAGE — site_sections editor ──────────────────── */}
          <Route path="/sections/home_announcement_bar" element={<SectionEditorPage sectionKey="home_announcement_bar" />} />
          <Route path="/sections/home_hero" element={<SectionEditorPage sectionKey="home_hero" />} />
          <Route path="/sections/home_review_banner" element={<SectionEditorPage sectionKey="home_review_banner" />} />
          <Route path="/sections/home_value_strip" element={<SectionEditorPage sectionKey="home_value_strip" />} />
          <Route path="/sections/home_value_slider" element={<SectionEditorPage sectionKey="home_value_slider" />} />
          <Route path="/sections/home_about" element={<SectionEditorPage sectionKey="home_about" />} />
          <Route path="/sections/home_featured_collections" element={<SectionEditorPage sectionKey="home_featured_collections" />} />
          <Route path="/sections/home_cta" element={<SectionEditorPage sectionKey="home_cta" />} />
          <Route path="/sections/home_trending" element={<SectionEditorPage sectionKey="home_trending" />} />
          <Route path="/sections/home_testimonials_section" element={<SectionEditorPage sectionKey="home_testimonials_section" />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/sections/home_whatsapp_float" element={<SectionEditorPage sectionKey="home_whatsapp_float" />} />
          <Route path="/sections/scroll_to_top_settings" element={<SectionEditorPage sectionKey="scroll_to_top_settings" />} />

          {/* ── PRODUCTS ──────────────────────────────────────────── */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/categories" element={<GenericModulePage moduleKey="categories" title="Categories" description="Product categories — name, slug, description, and cover image." />} />
          <Route path="/product-reviews" element={<ProductReviewsPage />} />
          <Route path="/faqs/product" element={<FAQsPage defaultPage="product" />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/sections/products_specs_template" element={<SectionEditorPage sectionKey="products_specs_template" />} />
          <Route path="/sections/products_page_header" element={<SectionEditorPage sectionKey="products_page_header" />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/sections/products_filters_config" element={<SectionEditorPage sectionKey="products_filters_config" />} />

          {/* ── OFFERS ────────────────────────────────────────────── */}
          <Route path="/offers" element={<GenericModulePage moduleKey="offers" title="Offers & Promos" description="Active discount codes, promo banners, and seasonal deals." />} />
          <Route path="/sections/offers_page_header" element={<SectionEditorPage sectionKey="offers_page_header" />} />

          {/* ── BLOGS ─────────────────────────────────────────────── */}
          <Route path="/blogs" element={<GenericModulePage moduleKey="blogs" title="Blog Posts" description="Style guides, modesty articles, care advice, and collections editorials." />} />
          <Route path="/sections/blogs_page_header" element={<SectionEditorPage sectionKey="blogs_page_header" />} />
          <Route path="/sections/blogs_filters_config" element={<SectionEditorPage sectionKey="blogs_filters_config" />} />

          {/* ── ABOUT ─────────────────────────────────────────────── */}
          <Route path="/sections/about_stats" element={<SectionEditorPage sectionKey="about_stats" />} />
          <Route path="/sections/about_who_we_are" element={<SectionEditorPage sectionKey="about_who_we_are" />} />
          <Route path="/sections/about_mission" element={<SectionEditorPage sectionKey="about_mission" />} />

          {/* ── AFFILIATE ─────────────────────────────────────────── */}
          <Route path="/affiliates" element={<GenericModulePage moduleKey="affiliates" title="Affiliate Applications" description="Ambassador applications submitted via the Affiliate Program page." />} />
          <Route path="/sections/affiliate_program_settings" element={<SectionEditorPage sectionKey="affiliate_program_settings" />} />

          {/* ── CONTACT ───────────────────────────────────────────── */}
          <Route path="/messages" element={<GenericModulePage moduleKey="messages" title="Contact Messages" description="Customer enquiries submitted from the Contact Us form." />} />
          <Route path="/sections/contact_main_section" element={<SectionEditorPage sectionKey="contact_main_section" />} />
          <Route path="/sections/contact_channels" element={<SectionEditorPage sectionKey="contact_channels" />} />
          <Route path="/sections/contact_hours" element={<SectionEditorPage sectionKey="contact_hours" />} />
          <Route path="/sections/contact_faq" element={<SectionEditorPage sectionKey="contact_faq" />} />

          {/* ── PAGES ─────────────────────────────────────────────── */}
          <Route path="/sections/account_page_settings" element={<SectionEditorPage sectionKey="account_page_settings" />} />
          <Route path="/sections/cart_page_settings" element={<SectionEditorPage sectionKey="cart_page_settings" />} />
          <Route path="/sections/checkout_page_settings" element={<SectionEditorPage sectionKey="checkout_page_settings" />} />
          <Route path="/sections/payment_page_settings" element={<SectionEditorPage sectionKey="payment_page_settings" />} />
          <Route path="/sections/wishlist_page_settings" element={<SectionEditorPage sectionKey="wishlist_page_settings" />} />

          {/* ── CUSTOM ORDERS ─────────────────────────────────────── */}
          <Route path="/custom-orders" element={<GenericModulePage moduleKey="custom-orders" title="Custom Order Submissions" description="Bespoke tailoring requests with full measurements from CustomOrdersPage." />} />
          <Route path="/sections/custom_orders_settings" element={<SectionEditorPage sectionKey="custom_orders_settings" />} />

          {/* ── LOCATIONS PAGE ────────────────────────────────────── */}
          <Route path="/locations" element={<GenericModulePage moduleKey="locations" title="Store Locations" description="Individual boutique entries — name, city, address, hours, phone, email, WhatsApp, image, map URL." />} />
          <Route path="/sections/location_page_header" element={<SectionEditorPage sectionKey="location_page_header" />} />
          <Route path="/sections/location_visit_us_section" element={<SectionEditorPage sectionKey="location_visit_us_section" />} />
          <Route path="/sections/location_detail_page" element={<SectionEditorPage sectionKey="location_detail_page" />} />

          {/* ── GLOBAL: NAVBAR ────────────────────────────────────── */}
          <Route path="/sections/navbar_settings" element={<SectionEditorPage sectionKey="navbar_settings" />} />
          <Route path="/navbar-links" element={<GenericModulePage moduleKey="navbar-links" title="Navbar Links" description="Edit, reorder, and add navigation menu items and dropdowns." />} />

          {/* ── GLOBAL: FOOTER ────────────────────────────────────── */}
          <Route path="/footer-manager" element={<FooterManagerPage />} />
          <Route path="/sections/footer_settings" element={<SectionEditorPage sectionKey="footer_settings" />} />
          <Route path="/sections/footer_about_text" element={<SectionEditorPage sectionKey="footer_about_text" />} />
          <Route path="/footer-links" element={<GenericModulePage moduleKey="footer-links" title="Footer Links" description="Manage footer quick link groups and individual footer links." />} />

          {/* ── SUBMISSIONS ───────────────────────────────────────── */}
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/subscribers" element={<GenericModulePage moduleKey="subscribers" title="Newsletter Subscribers" description="Email subscribers collected from the footer newsletter sign-up form." />} />

          {/* ── OTHER ─────────────────────────────────────────────── */}
          <Route path="/users" element={<GenericModulePage moduleKey="users" title="Customer Users" description="Registered customer accounts and their profile details." />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;