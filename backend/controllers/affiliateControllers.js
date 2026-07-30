const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Phase 1: Apply for Affiliate
exports.applyAffiliate = async (req, res) => {
    try {
        const { full_name, email, phone, instagram_handle, tiktok_handle, website_url, country, promo_strategy, followers } = req.body;
        const [result] = await pool.query(
            `INSERT INTO affiliate_applications 
            (full_name, email, phone, instagram_handle, tiktok_handle, website_url, country, promo_strategy, followers) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, phone, instagram_handle, tiktok_handle, website_url, country, promo_strategy, followers]
        );
        res.status(201).json({ message: "Application submitted successfully", applicationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit application" });
    }
};

// Phase 2 (Admin): Get Applications
exports.getAffiliateApplications = async (req, res) => {
    try {
        const [applications] = await pool.query(`SELECT * FROM affiliate_applications ORDER BY created_at DESC`);
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};

// Phase 2 (Admin): Approve Affiliate
exports.approveAffiliate = async (req, res) => {
    try {
        const { application_id, plan_id = 1 } = req.body; // Default to Bronze plan

        // 1. Get Application
        const [appRes] = await pool.query(`SELECT * FROM affiliate_applications WHERE application_id = ?`, [application_id]);
        if (appRes.length === 0) return res.status(404).json({ error: "Application not found" });
        const app = appRes[0];

        if (app.status !== 'Pending') {
            return res.status(400).json({ error: "Application is already processed" });
        }

        // 2. Generate random password & Affiliate Code
        const tempPassword = crypto.randomBytes(4).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        const affiliateCode = `LHAF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // 3. Create User if not exists, else use existing
        let user_id;
        const [userRes] = await pool.query(`SELECT * FROM users WHERE email = ?`, [app.email]);
        if (userRes.length > 0) {
            user_id = userRes[0].user_id;
            // Optionally update password or keep existing. For simplicity, we just use the existing account.
        } else {
            const [newUserRes] = await pool.query(
                `INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
                [app.full_name, app.email, hashedPassword, app.phone, 'customer']
            );
            user_id = newUserRes.insertId;
        }

        // 4. Create Affiliate
        const [affiliateRes] = await pool.query(
            `INSERT INTO affiliates (user_id, affiliate_code, plan_id, status) VALUES (?, ?, ?, 'Approved')`,
            [user_id, affiliateCode, plan_id]
        );

        // 5. Update Application Status
        await pool.query(`UPDATE affiliate_applications SET status = 'Approved' WHERE application_id = ?`, [application_id]);

        // In a real app, send email here with tempPassword and affiliateCode.

        res.status(200).json({ 
            message: "Affiliate approved successfully", 
            affiliateCode, 
            tempPassword: userRes.length === 0 ? tempPassword : "User already exists. Ask them to login with existing password." 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to approve affiliate" });
    }
};

// Phase 2 (Admin): Reject Affiliate
exports.rejectAffiliate = async (req, res) => {
    try {
        const { application_id } = req.body;
        await pool.query(`UPDATE affiliate_applications SET status = 'Rejected' WHERE application_id = ?`, [application_id]);
        res.status(200).json({ message: "Affiliate rejected successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reject affiliate" });
    }
};

// Phase 3 (Admin): Set Commission Plan
exports.setCommissionPlan = async (req, res) => {
    try {
        const { affiliate_id, plan_id } = req.body;
        await pool.query(`UPDATE affiliates SET plan_id = ? WHERE affiliate_id = ?`, [plan_id, affiliate_id]);
        res.status(200).json({ message: "Commission plan updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update commission plan" });
    }
};

// Phase 5: Affiliate Login (Usually similar to normal user login, just returning affiliate data too)
exports.loginAffiliate = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const [affiliates] = await pool.query(`SELECT * FROM affiliates WHERE user_id = ?`, [user.user_id]);
        if (affiliates.length === 0) return res.status(403).json({ error: "User is not an affiliate" });

        const affiliate = affiliates[0];

        res.status(200).json({
            message: "Login successful",
            user: { id: user.user_id, name: user.full_name, email: user.email },
            affiliate: { id: affiliate.affiliate_id, code: affiliate.affiliate_code }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};

// Phase 5: Dashboard Data
exports.getAffiliateDashboard = async (req, res) => {
    try {
        const affiliate_id = req.query.affiliate_id; // In production, get from JWT

        const [clicks] = await pool.query(`SELECT COUNT(*) as count FROM affiliate_clicks WHERE affiliate_id = ?`, [affiliate_id]);
        
        const [commissions] = await pool.query(`
            SELECT 
                COUNT(*) as sales,
                SUM(sale_amount) as revenue,
                SUM(CASE WHEN status = 'Pending' THEN commission_amount ELSE 0 END) as pending_commission,
                SUM(CASE WHEN status = 'Approved' THEN commission_amount ELSE 0 END) as approved_commission,
                SUM(CASE WHEN status = 'Paid' THEN commission_amount ELSE 0 END) as paid_commission
            FROM commissions
            WHERE affiliate_id = ?`, [affiliate_id]);

        res.status(200).json({
            clicks: clicks[0].count,
            sales: commissions[0].sales || 0,
            revenue: commissions[0].revenue || 0,
            pending_commission: commissions[0].pending_commission || 0,
            approved_commission: commissions[0].approved_commission || 0,
            paid_commission: commissions[0].paid_commission || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};

// Phase 6: Handle Referral Click and redirect
exports.handleReferralClick = async (req, res) => {
    try {
        const affiliateCode = req.params.affiliateCode;
        const [affiliates] = await pool.query(`SELECT affiliate_id FROM affiliates WHERE affiliate_code = ?`, [affiliateCode]);
        
        if (affiliates.length > 0) {
            const affiliate_id = affiliates[0].affiliate_id;
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const browser = req.headers['user-agent'];
            
            await pool.query(
                `INSERT INTO affiliate_clicks (affiliate_id, ip_address, browser) VALUES (?, ?, ?)`,
                [affiliate_id, ip, browser]
            );

            // Set cookie (expires in 30 days)
            res.cookie('affiliate_code', affiliateCode, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        }

        // Redirect to homepage or intended landing page
        res.redirect(302, 'http://localhost:3000/'); 
    } catch (error) {
        console.error(error);
        res.redirect(302, 'http://localhost:3000/');
    }
};

// Utility APIs for lists
exports.getAffiliateClicks = async (req, res) => {
    try {
        const affiliate_id = req.query.affiliate_id;
        const [clicks] = await pool.query(`SELECT * FROM affiliate_clicks WHERE affiliate_id = ? ORDER BY created_at DESC`, [affiliate_id]);
        res.status(200).json(clicks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clicks" });
    }
};

exports.getAffiliateSales = async (req, res) => {
    try {
        const affiliate_id = req.query.affiliate_id;
        const [sales] = await pool.query(`SELECT * FROM commissions WHERE affiliate_id = ? ORDER BY created_at DESC`, [affiliate_id]);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sales" });
    }
};

exports.getAffiliateCommissions = exports.getAffiliateSales; // Same data for now

exports.getAdminCommissions = async (req, res) => {
    try {
        const [commissions] = await pool.query(`
            SELECT c.*, a.affiliate_code, u.full_name as affiliate_name 
            FROM commissions c
            JOIN affiliates a ON c.affiliate_id = a.affiliate_id
            JOIN users u ON a.user_id = u.user_id
            ORDER BY c.created_at DESC
        `);
        res.status(200).json(commissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch commissions" });
    }
};

exports.approveCommission = async (req, res) => {
    try {
        const { commission_id } = req.body;
        await pool.query(`UPDATE commissions SET status = 'Approved' WHERE commission_id = ?`, [commission_id]);
        res.status(200).json({ message: "Commission approved" });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve commission" });
    }
};

exports.rejectCommission = async (req, res) => {
    try {
        const { commission_id } = req.body;
        await pool.query(`UPDATE commissions SET status = 'Rejected' WHERE commission_id = ?`, [commission_id]);
        res.status(200).json({ message: "Commission rejected" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reject commission" });
    }
};

// Phase 12: Monthly Payout
exports.processPayout = async (req, res) => {
    try {
        const { affiliate_id, payment_method } = req.body;

        // Calculate total approved commissions
        const [results] = await pool.query(`
            SELECT SUM(commission_amount) as total_approved 
            FROM commissions 
            WHERE affiliate_id = ? AND status = 'Approved'
        `, [affiliate_id]);

        const totalToPay = results[0].total_approved;

        if (!totalToPay || totalToPay <= 0) {
            return res.status(400).json({ error: "No approved commissions to pay" });
        }

        // Mark them as paid
        await pool.query(`
            UPDATE commissions 
            SET status = 'Paid' 
            WHERE affiliate_id = ? AND status = 'Approved'
        `, [affiliate_id]);

        // Create payout record
        const [payoutResult] = await pool.query(`
            INSERT INTO payouts (affiliate_id, amount, payment_method, status)
            VALUES (?, ?, ?, 'Paid')
        `, [affiliate_id, totalToPay, payment_method]);

        res.status(200).json({ message: "Payout processed successfully", amount_paid: totalToPay, payout_id: payoutResult.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process payout" });
    }
};
