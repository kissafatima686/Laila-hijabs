const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const affiliateRoutes = require("./routes/affiliateRoutes");
const affiliateControllers = require("./controllers/affiliateControllers");
const { getSectionByKey, getAllSections, subscribeNewsletter } = require("./controllers/adminControllers");

const path = require("path");

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api", productRoutes);
app.use("/api/affiliate", affiliateRoutes);

// Referral Link Route
app.get("/ref/:affiliateCode", affiliateControllers.handleReferralClick);

// ─── Public CMS Sections (read-only for frontend) ──────────────────────────────
// Frontend components call GET /api/sections to load all dynamic content globally
app.get("/api/sections", getAllSections);
// Frontend components call GET /api/sections/:key to load specific dynamic content
app.get("/api/sections/:key", getSectionByKey);

// ─── Public Newsletter Subscription (footer form) ──────────────────────────────
app.post("/api/newsletter/subscribe", subscribeNewsletter);

// Test/Healthcheck Route
app.get("/", (req, res) => {
    res.json({ message: "Laila Hijabs Node.js + Express + MySQL Backend is Running!" });
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server and Test Database Connection
app.listen(PORT, async () => {
    console.log(` Server running on http://localhost:${PORT}`);
    await testConnection();
});
