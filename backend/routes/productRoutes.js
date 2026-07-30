const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductBySlug, 
  getCategories, 
  createOrder, 
  submitCustomOrder, 
  submitAffiliateApplication, 
  submitContactMessage, 
  getActiveOffers, 
  getStoreLocations, 
  getBlogs,
  getProductReviews,
  submitProductReview
} = require('../controllers/productController');

// Categories & Products
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// Customer Checkout Order
router.post('/orders', createOrder);

// Custom Bespoke Tailoring Orders Form (CustomOrdersPage.jsx)
router.post('/custom-orders', submitCustomOrder);

// Affiliate Application Form (Affiliatepage.jsx)
router.post('/affiliate/apply', submitAffiliateApplication);

// Contact Us Form (ContactUs.jsx)
router.post('/contact', submitContactMessage);

// Active Offers & Promos (OffersPage.jsx)
router.get('/offers', getActiveOffers);

// Boutique Store Locations (LocationDetailPage.jsx)
router.get('/locations', getStoreLocations);

// Customer Product Reviews & Submission (ProductDetail.jsx)
router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', submitProductReview);

module.exports = router;
