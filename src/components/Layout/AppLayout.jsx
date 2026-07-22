import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import ScrollToTop from './ScrollToTop';
import ScrollToTopOnNavigation from './ScrollToTopOnNavigation';
import WhatsAppFloat from './WhatsAppFloat';

const AppLayout = ({ children }) => {
  return (
    <div className="app-wrapper">
      {/* Scroll to top of page on every link navigation */}
      <ScrollToTopOnNavigation />

      {/* Navbar handles its own full-width spanning */}
      <Navbar /> 
      
      {/* 
        main-content fills the space between Header and Footer.
        We do NOT add a 'wrap' class here so the background colors 
        can span the full width. 
      */}
      <main className="main-content">
        {children} 
      </main>
      
      <Footer /> 
      
      {/* Floating scroll to top button */}
      <ScrollToTop />
      
      {/* Global WhatsApp floating button */}
      <WhatsAppFloat />
    </div>
  );
};

export default AppLayout;