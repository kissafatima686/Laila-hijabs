const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllSections,
  getSectionByKey,
  updateSection,
  deleteSection,
  getModuleItems,
  createModuleItem,
  updateModuleItem,
  toggleModuleItemStatus,
  deleteModuleItem,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAdminProductDetails,
  getProductSections,
  getDisplaySections,
  subscribeNewsletter,
  getAdminAffiliateDetails,
  getPayoutsSummary,
  processPayout
} = require('../controllers/adminControllers');

// Dashboard
router.get('/stats', getDashboardStats);

// ─── Site Sections CMS (Page Text, Images, FAQs, Pillars) ─────────────────────
router.get('/sections', getAllSections);
router.get('/sections/:key', getSectionByKey);
router.put('/sections/:key', updateSection);
router.delete('/sections/:key', deleteSection);

// ─── Generic Module CRUD (lists, submissions, etc.) ───────────────────────────
router.get('/module/:moduleName', getModuleItems);
router.post('/module/:moduleName', createModuleItem);
router.put('/module/:moduleName/:id', updateModuleItem);
router.put('/module/:moduleName/:id/status', toggleModuleItemStatus);
router.delete('/module/:moduleName/:id', deleteModuleItem);

// ─── Affiliate Specific ──────────────────────────────────────────────────────
router.get('/affiliate-details/:id', getAdminAffiliateDetails);
router.get('/payouts/summary', getPayoutsSummary);
router.post('/payouts/process', processPayout);

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ─── Products ─────────────────────────────────────────────────────────────────
router.get('/products', getAllProducts);
router.get('/products/:id', getAdminProductDetails);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/product-sections', getProductSections);
router.get('/display-sections', getDisplaySections);

// ─── Newsletter ───────────────────────────────────────────────────────────────
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;