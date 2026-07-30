const express = require("express");
const router = express.Router();
const affiliateControllers = require("../controllers/affiliateControllers");

// User / Affiliate Facing Endpoints
router.post("/apply", affiliateControllers.applyAffiliate);
router.post("/login", affiliateControllers.loginAffiliate);
router.get("/dashboard", affiliateControllers.getAffiliateDashboard);
router.get("/clicks", affiliateControllers.getAffiliateClicks);
router.get("/sales", affiliateControllers.getAffiliateSales);
router.get("/commissions", affiliateControllers.getAffiliateCommissions);

// The referral link endpoint. Technically should be a top level route like /ref/:code
// But we will expose it here and also in server.js to match the user's /ref/:code pattern
router.get("/ref/:affiliateCode", affiliateControllers.handleReferralClick);

// Admin Facing Endpoints (Should be protected with admin middleware in production)
router.get("/admin/applications", affiliateControllers.getAffiliateApplications);
router.post("/admin/approve", affiliateControllers.approveAffiliate);
router.post("/admin/reject", affiliateControllers.rejectAffiliate);
router.post("/admin/set-commission", affiliateControllers.setCommissionPlan);

router.get("/admin/commissions", affiliateControllers.getAdminCommissions);
router.post("/admin/commission/approve", affiliateControllers.approveCommission);
router.post("/admin/commission/reject", affiliateControllers.rejectCommission);

router.post("/admin/payout", affiliateControllers.processPayout);

module.exports = router;
