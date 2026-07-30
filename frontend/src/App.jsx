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
import TermsConditions from './components/Footer/TermsConditions';
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import ContactUs from './components/Footer/ContactUs';
import FAQ from './components/Footer/FAQ';
import GiftCard from "./components/GiftCard/HowWeDoIt";
import CareRepair from './components/Footer/CareRepair';
import OurStory from './components/Footer/AboutUs/OurStory';
import Loyalty from "./components/Footer/AboutUs/Loyalty";
import VisitUs from "./components/Footer/AboutUs/VisitUs";
import Careers from "./components/Footer/AboutUs/Careers";
import Journal from "./components/Footer/AboutUs/Journal";
import AffiliateProgram from "./pages/Affiliatepage";
import FreeShipping from "./components/Footer/DeliverynReturn/FreeShipping";
import ShippingInfo from "./components/Footer/DeliverynReturn/ShippingInfo";
import Delivery from "./components/Footer/DeliverynReturn/Delivery";
import ReturnsExchanges from "./components/Footer/DeliverynReturn/ReturnsExchanges";
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
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/gift-card" element={<GiftCard />} />
              <Route path="/care-repair" element={<CareRepair />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/visit-us" element={<VisitUs />} />
              <Route path="/location/:id" element={<LocationDetailPage />} />
              <Route path="/careers" element={<Careers />} /> 
              <Route path="/journal" element={<Journal />} />  
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="/free-shipping" element={<FreeShipping />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/returns-exchanges" element={<ReturnsExchanges />} /> 
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