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
import ProductsSpecsTemplatePage from './pages/ProductsSpecsTemplatePage';
import ProductFiltersManagerPage from './pages/ProductFiltersManagerPage';
import ProductReviewsPage from './pages/ProductReviewsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import FooterManagerPage from './pages/FooterManagerPage';
import CategoriesMegaMenuPage from './pages/CategoriesMegaMenuPage';
import SearchBarKeywordsPage from './pages/SearchBarKeywordsPage';
import CustomerAccountsManagerPage from './pages/CustomerAccountsManagerPage';
import WishlistManagerPage from './pages/WishlistManagerPage';
import CartManagerPage from './pages/CartManagerPage';
import CheckoutManagerPage from './pages/CheckoutManagerPage';
import PaymentManagerPage from './pages/PaymentManagerPage';
import AnnouncementBarManagerPage from './pages/AnnouncementBarManagerPage';
import HeroSlidersPage from './pages/HeroSlidersPage';
import ReviewBannerManagerPage from './pages/ReviewBannerManagerPage';
import ValueStripManagerPage from './pages/ValueStripManagerPage';
import ValueSliderManagerPage from './pages/ValueSliderManagerPage';
import TrendingManagerPage from './pages/TrendingManagerPage';
import FeaturedCollectionsManagerPage from './pages/FeaturedCollectionsManagerPage';
import HowWeDoItPage from './pages/HowWeDoItPage';
import OffersManagerPage from './pages/OffersManagerPage';
import OffersBundlesPageManager from './pages/OffersBundlesPageManager';
import AdminAffiliateDetails from './pages/AdminAffiliateDetails';
import AdminPayouts from './pages/AdminPayouts';
import LocationDetailsEditorPage from './pages/LocationDetailsEditorPage';
import VisitUsSliderManagerPage from './pages/VisitUsSliderManagerPage';
import AboutWhoWeAreManagerPage from './pages/AboutWhoWeAreManagerPage';
import AffiliateProgramManagerPage from './pages/AffiliateProgramManagerPage';
import BlogsPageManager from './pages/BlogsPageManager';
import BlogDetailPageEditor from './pages/BlogDetailPageEditor';
import CustomOrderPageManager from './pages/CustomOrderPageManager';
import SocialMediaManagerPage from './pages/SocialMediaManagerPage';
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
          <Route path="/sliders" element={<HeroSlidersPage />} />
          <Route path="/hero-sliders" element={<HeroSlidersPage />} />

          {/* ── HOME PAGE — site_sections editor ──────────────────── */}
          <Route path="/sections/home_announcement_bar" element={<AnnouncementBarManagerPage />} />
          <Route path="/announcement-bar-manager" element={<AnnouncementBarManagerPage />} />
          <Route path="/sections/home_hero" element={<SectionEditorPage sectionKey="home_hero" />} />
          <Route path="/sections/home_review_banner" element={<ReviewBannerManagerPage />} />
          <Route path="/review-banner-manager" element={<ReviewBannerManagerPage />} />
          <Route path="/sections/home_value_strip" element={<ValueStripManagerPage />} />
          <Route path="/value-features-strip-manager" element={<ValueStripManagerPage />} />
          <Route path="/sections/home_value_slider" element={<ValueSliderManagerPage />} />
          <Route path="/interactive-value-slider-manager" element={<ValueSliderManagerPage />} />
          <Route path="/sections/home_featured_collections" element={<FeaturedCollectionsManagerPage />} />
          <Route path="/featured-collections-manager" element={<FeaturedCollectionsManagerPage />} />
          <Route path="/sections/home_cta" element={<HowWeDoItPage />} />
          <Route path="/how-we-do-it" element={<HowWeDoItPage />} />
          <Route path="/sections/home_trending" element={<TrendingManagerPage />} />
          <Route path="/trending-manager" element={<TrendingManagerPage />} />
          <Route path="/sections/home_social_media" element={<SocialMediaManagerPage />} />
          <Route path="/social-media-manager" element={<SocialMediaManagerPage />} />
          <Route path="/sections/home_testimonials_section" element={<SectionEditorPage sectionKey="home_testimonials_section" />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/sections/home_whatsapp_float" element={<SectionEditorPage sectionKey="home_whatsapp_float" />} />
          <Route path="/sections/scroll_to_top_settings" element={<SectionEditorPage sectionKey="scroll_to_top_settings" />} />

          {/* ── PRODUCTS ──────────────────────────────────────────── */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/categories" element={<FeaturedCollectionsManagerPage />} />
          <Route path="/product-reviews" element={<ProductReviewsPage />} />
          <Route path="/faqs/product" element={<FAQsPage defaultPage="product" />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/sections/products_specs_template" element={<ProductsSpecsTemplatePage />} />
          <Route path="/sections/products_page_header" element={<SectionEditorPage sectionKey="products_page_header" />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/sections/products_filters_config" element={<ProductFiltersManagerPage />} />
          <Route path="/filters" element={<ProductFiltersManagerPage />} />
          <Route path="/filters/fabrics" element={<ProductFiltersManagerPage activeTab="fabrics" />} />
          <Route path="/filters/sizes" element={<ProductFiltersManagerPage activeTab="sizes" />} />
          <Route path="/filters/colors" element={<ProductFiltersManagerPage activeTab="colors" />} />
          <Route path="/filters/prices" element={<ProductFiltersManagerPage activeTab="prices" />} />
          <Route path="/search-bar-keywords" element={<SearchBarKeywordsPage />} />

          {/* ── OFFERS & PROMOTIONS ────────────────────────────────── */}
          <Route path="/offers" element={<OffersManagerPage />} />
          <Route path="/offers/bundles" element={<OffersBundlesPageManager />} />
          <Route path="/offers/notify" element={<OffersManagerPage activeTab="notify" />} />

          {/* ── BLOGS ─────────────────────────────────────────────── */}
          <Route path="/blogs" element={<BlogDetailPageEditor />} />
          <Route path="/sections/blogs_page_header" element={<BlogsPageManager />} />

          {/* ── ABOUT ─────────────────────────────────────────────── */}
          <Route path="/sections/about_stats" element={<SectionEditorPage sectionKey="about_stats" />} />
          <Route path="/sections/about_who_we_are" element={<AboutWhoWeAreManagerPage />} />
          <Route path="/brand-overview" element={<AboutWhoWeAreManagerPage />} />
          <Route path="/sections/about_mission" element={<SectionEditorPage sectionKey="about_mission" />} />

          {/* ── AFFILIATE ─────────────────────────────────────────── */}
          <Route path="/affiliates" element={<GenericModulePage moduleKey="affiliates" title="Affiliate Applications" description="Ambassador applications submitted via the Affiliate Program page." />} />
          <Route path="/approved-affiliates" element={<GenericModulePage moduleKey="approved-affiliates" title="Approved Affiliates" description="Manage active affiliates and their referral links." />} />
          <Route path="/affiliate-details/:id" element={<AdminAffiliateDetails />} />
          <Route path="/commissions" element={<GenericModulePage moduleKey="commissions" title="Commissions" description="Manage affiliate commissions generated from orders." />} />
          <Route path="/payouts" element={<AdminPayouts />} />
          <Route path="/sections/affiliate_program_settings" element={<AffiliateProgramManagerPage />} />

          {/* ── CONTACT ───────────────────────────────────────────── */}
          <Route path="/messages" element={<GenericModulePage moduleKey="messages" title="Contact Messages" description="Customer enquiries submitted from the Contact Us form." />} />

          {/* ── PAGES ─────────────────────────────────────────────── */}
          <Route path="/sections/account_page_settings" element={<SectionEditorPage sectionKey="account_page_settings" />} />
          <Route path="/sections/cart_page_settings" element={<CartManagerPage />} />
          <Route path="/cart-manager" element={<CartManagerPage />} />
          <Route path="/sections/checkout_page_settings" element={<CheckoutManagerPage />} />
          <Route path="/checkout-manager" element={<CheckoutManagerPage />} />
          <Route path="/sections/payment_page_settings" element={<PaymentManagerPage />} />
          <Route path="/payment-manager" element={<PaymentManagerPage />} />
          <Route path="/sections/wishlist_page_settings" element={<WishlistManagerPage />} />
          <Route path="/wishlist-manager" element={<WishlistManagerPage />} />

          {/* ── CUSTOM ORDERS ─────────────────────────────────────── */}
          <Route path="/custom-orders" element={<GenericModulePage moduleKey="custom_orders" title="Custom Order Requests" description="Client custom design enquiries submitted from the Custom Order page." />} />
          <Route path="/sections/custom_orders_settings" element={<CustomOrderPageManager />} />

          {/* ── LOCATIONS PAGE ────────────────────────────────────── */}
          <Route path="/locations" element={<GenericModulePage moduleKey="locations" title="Store Locations" description="Individual boutique entries — name, city, address, hours, phone, email, WhatsApp, image, map URL." />} />
          <Route path="/sections/location_page_header" element={<SectionEditorPage sectionKey="location_page_header" />} />
          <Route path="/sections/location_visit_us_section" element={<VisitUsSliderManagerPage />} />
          <Route path="/visit-us-slider" element={<VisitUsSliderManagerPage />} />
          <Route path="/sections/location_detail_page" element={<LocationDetailsEditorPage />} />
          <Route path="/location-details" element={<LocationDetailsEditorPage />} />

          {/* ── DYNAMIC SECTION FALLBACK ROUTE ── */}
          <Route path="/sections/:sectionKey" element={<SectionEditorPage />} />

          {/* ── GLOBAL: NAVBAR ────────────────────────────────────── */}
          <Route path="/sections/navbar_settings" element={<SectionEditorPage sectionKey="navbar_settings" />} />
          <Route path="/navbar-links" element={<GenericModulePage moduleKey="navbar-links" title="Navbar Links" description="Edit, reorder, and add navigation menu items and dropdowns." />} />
          <Route path="/categories-mega-menu" element={<CategoriesMegaMenuPage />} />

          {/* ── GLOBAL: FOOTER ────────────────────────────────────── */}
          <Route path="/footer-manager" element={<FooterManagerPage />} />
          <Route path="/sections/footer_settings" element={<FooterManagerPage initialTab="copyright" />} />
          <Route path="/footer-copyright" element={<FooterManagerPage initialTab="copyright" />} />
          <Route path="/sections/footer_about_text" element={<SectionEditorPage sectionKey="footer_about_text" />} />
          <Route path="/footer-links" element={<GenericModulePage moduleKey="footer-links" title="Footer Links" description="Manage footer quick link groups and individual footer links." />} />

          {/* ── SUBMISSIONS & USERS ───────────────────────────────── */}
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/subscribers" element={<GenericModulePage moduleKey="subscribers" title="Newsletter Subscribers" description="Email subscribers collected from the footer newsletter sign-up form." />} />
          <Route path="/users" element={<CustomerAccountsManagerPage />} />
          <Route path="/customer-accounts-manager" element={<CustomerAccountsManagerPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;