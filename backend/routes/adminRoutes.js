const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllSections,
  getSectionByKey,
  updateSection,
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
  subscribeNewsletter
} = require('../controllers/adminControllers');

// Dashboard
router.get('/stats', getDashboardStats);

// ─── Site Sections CMS (Page Text, Images, FAQs, Pillars) ─────────────────────
router.get('/sections', getAllSections);
router.get('/sections/:key', getSectionByKey);
router.put('/sections/:key', updateSection);

// ─── Generic Module CRUD (lists, submissions, etc.) ───────────────────────────
router.get('/module/:moduleName', getModuleItems);
router.post('/module/:moduleName', createModuleItem);
router.put('/module/:moduleName/:id', updateModuleItem);
router.put('/module/:moduleName/:id/status', toggleModuleItemStatus);
router.delete('/module/:moduleName/:id', deleteModuleItem);

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ─── Products ─────────────────────────────────────────────────────────────────
router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ─── Newsletter ───────────────────────────────────────────────────────────────
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;