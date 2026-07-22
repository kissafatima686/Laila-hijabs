// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home';
import OffersPage from './pages/OffersPage';
import AllCategoriesPage from './pages/AllCategoriesPage'; 
import CategoriesPage from './pages/CategoriesPage';
import CustomOrdersPage from './pages/CustomOrdersPage';
import AboutUsPage from './pages/AboutUsPage';
import BlogsPage from './pages/BlogsPage'; // 1. Import the new page
import AffiliatePage from './pages/AffiliatePage'; // 1. Import the new page
import SizeGuide from './pages/SizeGuide';
import TermsConditions from './components/Footer/TermsConditions';
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import ContactUs from './components/Footer/ContactUs';
import FAQ from './components/Footer/FAQ'; // Import the FAQ component
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
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProductGalleryPage from "./pages/ProductGalleryPage";
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/categories/:categoryId" element={<CategoriesPage />} />
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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </AppLayout>
    </Router>
  </CartProvider>
  );
}

export default App;