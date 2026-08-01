import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/useAuth';
import AdminLayout from './components/AdminLayout';

// Lazy load all pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GenericModulePage = lazy(() => import('./pages/GenericModulePage'));
const SectionEditorPage = lazy(() => import('./pages/SectionEditorPage'));
const ProductsList = lazy(() => import('./pages/products/ProductsList'));
const ProductEditPage = lazy(() => import('./pages/products/ProductEditPage'));
const OrdersList = lazy(() => import('./pages/orders/OrdersList'));
const Settings = lazy(() => import('./pages/Settings'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const FAQsPage = lazy(() => import('./pages/FAQsPage'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'));
const ProductsSpecsTemplatePage = lazy(() => import('./pages/ProductsSpecsTemplatePage'));
const ProductFiltersManagerPage = lazy(() => import('./pages/ProductFiltersManagerPage'));
const ProductReviewsPage = lazy(() => import('./pages/ProductReviewsPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const FooterManagerPage = lazy(() => import('./pages/FooterManagerPage'));
const CategoriesMegaMenuPage = lazy(() => import('./pages/CategoriesMegaMenuPage'));
const SearchBarKeywordsPage = lazy(() => import('./pages/SearchBarKeywordsPage'));
const CustomerAccountsManagerPage = lazy(() => import('./pages/CustomerAccountsManagerPage'));
const WishlistManagerPage = lazy(() => import('./pages/WishlistManagerPage'));
const CartManagerPage = lazy(() => import('./pages/CartManagerPage'));
const CheckoutManagerPage = lazy(() => import('./pages/CheckoutManagerPage'));
const PaymentManagerPage = lazy(() => import('./pages/PaymentManagerPage'));
const AnnouncementBarManagerPage = lazy(() => import('./pages/AnnouncementBarManagerPage'));
const HeroSlidersPage = lazy(() => import('./pages/HeroSlidersPage'));
const ReviewBannerManagerPage = lazy(() => import('./pages/ReviewBannerManagerPage'));
const ValueStripManagerPage = lazy(() => import('./pages/ValueStripManagerPage'));
const ValueSliderManagerPage = lazy(() => import('./pages/ValueSliderManagerPage'));
const TrendingManagerPage = lazy(() => import('./pages/TrendingManagerPage'));
const FeaturedCollectionsManagerPage = lazy(() => import('./pages/FeaturedCollectionsManagerPage'));
const HowWeDoItPage = lazy(() => import('./pages/HowWeDoItPage'));
const OffersManagerPage = lazy(() => import('./pages/OffersManagerPage'));
const OffersBundlesPageManager = lazy(() => import('./pages/OffersBundlesPageManager'));
const AdminAffiliateDetails = lazy(() => import('./pages/AdminAffiliateDetails'));
const AdminPayouts = lazy(() => import('./pages/AdminPayouts'));
const LocationDetailsEditorPage = lazy(() => import('./pages/LocationDetailsEditorPage'));
const VisitUsSliderManagerPage = lazy(() => import('./pages/VisitUsSliderManagerPage'));
const AboutWhoWeAreManagerPage = lazy(() => import('./pages/AboutWhoWeAreManagerPage'));
const AffiliateProgramManagerPage = lazy(() => import('./pages/AffiliateProgramManagerPage'));
const BlogsPageManager = lazy(() => import('./pages/BlogsPageManager'));
const BlogDetailPageEditor = lazy(() => import('./pages/BlogDetailPageEditor'));
const CustomOrderPageManager = lazy(() => import('./pages/CustomOrderPageManager'));
const SocialMediaManagerPage = lazy(() => import('./pages/SocialMediaManagerPage'));
const ContactMessagesManagerPage = lazy(() => import('./pages/ContactMessagesManagerPage'));

import './App.css';

const Loading = () => <div style={{ color: '#F6F1E3', padding: '20px' }}>Loading page...</div>;

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
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
            <Route path="/products/:id" element={<ProductEditPage />} />
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
            <Route path="/messages" element={<ContactMessagesManagerPage />} />

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
      </Suspense>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
