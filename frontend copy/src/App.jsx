// src/App.jsx (FRONTEND ONLY)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home';
import OffersPage from './pages/OffersPage';
import AllCategoriesPage from './pages/AllCategoriesPage'; 
import CategoriesPage from './pages/CategoriesPage';
import CustomOrdersPage from './pages/CustomOrdersPage';
import AboutUsPage from './pages/AboutUsPage';
import BlogsPage from './pages/BlogsPage';
import AffiliatePage from './pages/Affiliatepage';
import SizeGuide from './pages/SizeGuide';
import DynamicTextPage from './components/Footer/DynamicTextPage';
import ContactUs from './components/Footer/ContactUs';
import FAQ from './components/Footer/FAQ';
import GiftCard from "./components/GiftCard/HowWeDoIt";
import AffiliateProgram from "./pages/Affiliatepage";
import OurStory from './components/Footer/AboutUs/OurStory';
import AffiliateLogin from "./pages/AffiliateLogin";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AffiliateRedirect from "./pages/AffiliateRedirect";
import ProductDetail from "./components/Products/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckOutPage";
import PaymentPage from "./pages/PaymentPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProductGalleryPage from "./pages/ProductGalleryPage";
import LocationDetailPage from "./pages/LocationDetailPage";

// Contexts
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/useAuth';
import { ContentProvider } from './context/useContent';

// Admin Login Import
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
          <Routes>
            {/* ── 1. STANDALONE ADMIN LOGIN ROUTES ── */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── 2. STOREFRONT ROUTES (Using AppLayout as a parent route wrapper) ── */}
            <Route path="/ref/:code" element={<AffiliateRedirect />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/categories" element={<AllCategoriesPage />} />
              <Route path="/categories/:categoryId" element={<CategoriesPage />} />
              <Route path="/collections" element={<CategoriesPage />} />
              <Route path="/custom-orders" element={<CustomOrdersPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
              <Route path="/affiliate" element={<AffiliatePage />} /> 
              <Route path="/affiliate/login" element={<AffiliateLogin />} />
              <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/terms-conditions" element={<DynamicTextPage sectionKey="terms_conditions" fallbackTitle="Terms & Conditions" />} />
              <Route path="/privacy-policy" element={<DynamicTextPage sectionKey="privacy_policy" fallbackTitle="Privacy Policy" />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/gift-card" element={<GiftCard />} />
              <Route path="/gift-cards" element={<GiftCard />} />
              <Route path="/care-repair" element={<DynamicTextPage sectionKey="care_repair" fallbackTitle="Care & Repair" />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/loyalty" element={<DynamicTextPage sectionKey="loyalty" fallbackTitle="Loyalty Program" />} />
              <Route path="/visit-us" element={<DynamicTextPage sectionKey="visit_us" fallbackTitle="Visit Us" />} />
              <Route path="/location/:id" element={<LocationDetailPage />} />
              <Route path="/careers" element={<DynamicTextPage sectionKey="careers" fallbackTitle="Careers" />} /> 
              <Route path="/journal" element={<DynamicTextPage sectionKey="blogs_page_header" fallbackTitle="Journal" />} />  
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="/free-shipping" element={<DynamicTextPage sectionKey="free_shipping" fallbackTitle="Free Shipping" />} />
              <Route path="/shipping-info" element={<DynamicTextPage sectionKey="shipping_info" fallbackTitle="Shipping Information" />} />
              <Route path="/delivery" element={<DynamicTextPage sectionKey="delivery" fallbackTitle="Delivery" />} />
              <Route path="/returns-exchanges" element={<DynamicTextPage sectionKey="returns_exchanges" fallbackTitle="Returns & Exchanges" />} /> 
              <Route path="/Products/:slug" element={<ProductDetail />} />
              <Route path="/Products/:slug/gallery" element={<ProductGalleryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>

            {/* Redirect /cart to CartPage (already inside AppLayout) */}
            <Route path="/cart" element={<Navigate to="/" replace />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
        </CartProvider>
      </AuthProvider>
    </ContentProvider>
  );
}

export default App;