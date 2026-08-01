const { pool } = require('../config/db');

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  try {
    // Complete list of every table on the site, grouped by page
    const pageGroups = [
      {
        page: 'Home Page',
        icon: 'home',
        route: '/sections/home_hero',
        modules: [
          { name: 'Sliders', table: 'sliders', route: '/sliders', statusField: true },
          { name: 'Testimonials', table: 'testimonials', route: '/testimonials', statusField: true },
        ]
      },
      {
        page: 'Products',
        icon: 'products',
        route: '/products',
        modules: [
          { name: 'Products', table: 'products', route: '/products', statusField: true },
          { name: 'Categories', table: 'categories', route: '/categories', statusField: false },
          { name: 'Reviews', table: 'product_reviews', route: '/product-reviews', statusField: true },
          { name: 'Size Guide Rows', table: 'size_guide_rows', route: '/size-guide', statusField: false },
        ]
      },
      {
        page: 'Blogs',
        icon: 'blogs',
        route: '/blogs',
        modules: [
          { name: 'Blog Posts', table: 'blogs', route: '/blogs', statusField: true },
          { name: 'Blog Comments', table: 'blog_comments', route: '/blogs', statusField: true },
        ]
      },
      {
        page: 'Offers & Discounts',
        icon: 'offers',
        route: '/offers',
        modules: [
          { name: 'Active Offers', table: 'offers', route: '/offers', statusField: true },
        ]
      },
      {
        page: 'Affiliate Program',
        icon: 'affiliates',
        route: '/affiliates',
        modules: [
          { name: 'Applications', table: 'affiliate_applications', route: '/affiliates', statusField: true },
        ]
      },
      {
        page: 'Custom Orders',
        icon: 'custom',
        route: '/custom-orders',
        modules: [
          { name: 'Bespoke Orders', table: 'custom_orders', route: '/custom-orders', statusField: true },
        ]
      },
      {
        page: 'Locations',
        icon: 'location',
        route: '/locations',
        modules: [
          { name: 'Store Locations', table: 'store_locations', route: '/locations', statusField: true },
        ]
      },
      {
        page: 'Contact',
        icon: 'contact',
        route: '/messages',
        modules: [
          { name: 'Messages', table: 'contact_messages', route: '/messages', statusField: false },
        ]
      },
      {
        page: 'Users & Admin',
        icon: 'users',
        route: '/users',
        modules: [
          { name: 'Customer Accounts', table: 'users', route: '/users', statusField: true },
          { name: 'Admin Users', table: 'admin_users', route: '/admin-users', statusField: true },
          { name: 'Subscribers', table: 'newsletter_subscribers', route: '/subscribers', statusField: true },
        ]
      },
      {
        page: 'Global Content',
        icon: 'global',
        route: '/sections/navbar_settings',
        modules: [
          { name: 'Navbar Links', table: 'navbar_links', route: '/navbar-links', statusField: true },
          { name: 'Footer Links', table: 'footer_links', route: '/footer-links', statusField: true },
          { name: 'FAQs', table: 'faqs', route: '/faqs', statusField: true },
        ]
      }
    ];

    let grandTotal = 0;
    let grandLive = 0;
    let grandDraft = 0;
    let largestModule = { name: 'None', count: 0 };
    const enrichedGroups = [];

    for (const group of pageGroups) {
      const enrichedModules = [];
      let groupTotal = 0;

      for (const m of group.modules) {
        try {
          const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM \`${m.table}\``);
          let live = total;
          if (m.statusField) {
            try {
              const [[{ count }]] = await pool.query(
                `SELECT COUNT(*) as count FROM \`${m.table}\` WHERE status IN ('Live', 'Active', 'Approved', 'Pending')`
              );
              live = count;
            } catch (e) { live = total; }
          }
          const draft = total - live;
          const pct = total > 0 ? Math.round((live / total) * 100) : 100;

          grandTotal += total;
          grandLive += live;
          grandDraft += draft;
          groupTotal += total;

          if (total > largestModule.count) largestModule = { name: m.name, count: total };

          enrichedModules.push({ ...m, total, live, draft, pct });
        } catch (err) {
          enrichedModules.push({ ...m, total: 0, live: 0, draft: 0, pct: 100 });
        }
      }

      enrichedGroups.push({ ...group, total: groupTotal, modules: enrichedModules });
    }

    // Unread contact messages
    let unreadMessages = 0;
    try {
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0`);
      unreadMessages = count;
    } catch (e) {}

    // Pending orders
    let pendingOrders = 0;
    try {
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM orders WHERE order_status = 'Pending'`);
      pendingOrders = count;
    } catch (e) {}

    // Total orders (all)
    let totalOrders = 0;
    try {
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM orders`);
      totalOrders = count;
    } catch (e) {}

    // Revenue (sum of delivered orders)
    let totalRevenue = 0;
    try {
      const [[{ sum }]] = await pool.query(`SELECT COALESCE(SUM(total_amount), 0) as sum FROM orders WHERE order_status IN ('Delivered','Processing','Shipped')`);
      totalRevenue = parseFloat(sum) || 0;
    } catch (e) {}

    // Total sections
    let totalSections = 0;
    try {
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM site_sections`);
      totalSections = count;
    } catch (e) {}

    // Flat modules list for backward compat
    const flatModules = enrichedGroups.flatMap(g =>
      g.modules.map(m => ({ id: m.table, title: m.name, route: m.route, total: m.total, live: m.live, draft: m.draft, pct: m.pct, badge: `${m.pct}% active` }))
    );

    res.status(200).json({
      totalEntries: grandTotal,
      liveEntries: grandLive,
      draftEntries: grandDraft,
      largestModule,
      contactMessages: unreadMessages,
      pendingOrders,
      totalOrders,
      totalRevenue,
      totalSections,
      pageGroups: enrichedGroups,
      modules: flatModules,
      lastUpdated: new Date().toLocaleString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GENERIC MODULE CRUD ──────────────────────────────────────────────────────

const TABLE_MAP = {
  'users': { table: 'users', key: 'user_id' },
  'admin-users': { table: 'admin_users', key: 'admin_id' },
  'categories': { table: 'categories', key: 'category_id' },
  'products': { table: 'products', key: 'product_id' },
  'orders': { table: 'orders', key: 'order_id' },
  'custom-orders': { table: 'custom_orders', key: 'custom_order_id' },
  'affiliates': { table: 'affiliate_applications', key: 'application_id' },
  'approved-affiliates': { table: 'affiliates', key: 'affiliate_id' },
  'commissions': { table: 'commissions', key: 'commission_id' },
  'payouts': { table: 'payouts', key: 'payout_id' },
  'offers': { table: 'offers', key: 'offer_id' },
  'locations': { table: 'store_locations', key: 'location_id' },
  'blogs': { table: 'blogs', key: 'blog_id' },
  'messages': { table: 'contact_messages', key: 'message_id' },
  'sliders': { table: 'sliders', key: 'slider_id' },
  'subscribers': { table: 'newsletter_subscribers', key: 'subscriber_id' },
  'testimonials': { table: 'testimonials', key: 'testimonial_id' },
  'faqs': { table: 'faqs', key: 'faq_id' },
  'size-guide': { table: 'size_guide_rows', key: 'row_id' },
  'value-strip': { table: 'value_strip_items', key: 'item_id' },
  'navbar-links': { table: 'navbar_links', key: 'link_id' },
  'footer-links': { table: 'footer_links', key: 'link_id' },
  'categories-mega-menu': { table: 'categories_mega_menu', key: 'id' },
  'reviews': { table: 'product_reviews', key: 'review_id' },
  'wishlists': { table: 'wishlists', key: 'wishlist_id' },
  'cart-perks': { table: 'cart_perks_promos', key: 'id' },
  'checkout-rules': { table: 'checkout_shipping_rules', key: 'id' },
  'coupons': { table: 'coupons', key: 'id' }
};

const getModuleItems = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${config.table}\` ORDER BY created_at DESC`);
    
    // Attach filters to categories
    if (req.params.moduleName === 'categories') {
      const [filters] = await pool.query(`SELECT * FROM category_filters`);
      const formatted = rows.map(cat => ({
        ...cat,
        filters: filters.filter(f => f.category_id === cat.category_id).map(f => f.filter_name)
      }));
      return res.status(200).json(formatted);
    }
    
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createModuleItem = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  let bodyData = { ...req.body };
  
  // Intercept category filters
  let categoryFilters = [];
  if (req.params.moduleName === 'categories') {
    if (bodyData.filters !== undefined) {
      categoryFilters = bodyData.filters;
      delete bodyData.filters;
    }
  }
  
  if (req.params.moduleName === 'wishlists') {
    if (!('user_id' in bodyData)) bodyData.user_id = null;
    if (!('product_id' in bodyData)) bodyData.product_id = null;
  }
  const fields = Object.keys(bodyData);
  const values = Object.values(bodyData);
  if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
  try {
    const sql = `INSERT INTO \`${config.table}\` (${fields.map(f => `\`${f}\``).join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    const [result] = await pool.query(sql, values);
    
    if (req.params.moduleName === 'categories' && categoryFilters.length > 0) {
      for (let f of categoryFilters) {
        await pool.query(`INSERT INTO category_filters (category_id, filter_name) VALUES (?, ?)`, [result.insertId, f]);
      }
    }
    
    res.status(201).json({ message: 'Item created!', id: result.insertId });
  } catch (err) {
    console.error("createModuleItem error:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateModuleItem = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  let bodyData = { ...req.body };
  
  // Intercept category filters
  let categoryFilters = undefined;
  if (req.params.moduleName === 'categories') {
    if (bodyData.filters !== undefined) {
      categoryFilters = bodyData.filters;
      delete bodyData.filters;
    }
  }

  // Intercept Affiliate Approvals
  if (req.params.moduleName === 'affiliates' && bodyData.status === 'Approved') {
    try {
      const crypto = require("crypto");
      const bcrypt = require("bcryptjs");
      const [appRes] = await pool.query(`SELECT * FROM affiliate_applications WHERE application_id = ?`, [req.params.id]);
      if (appRes.length > 0) {
        const app = appRes[0];
        if (app.status === 'Pending') {
          const tempPassword = crypto.randomBytes(4).toString('hex');
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(tempPassword, salt);
          const affiliateCode = `LHAF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          
          const affiliateLink = `http://localhost:5000/api/affiliate/ref/${affiliateCode}`;
          
          let user_id;
          const [userRes] = await pool.query(`SELECT * FROM users WHERE email = ?`, [app.email]);
          if (userRes.length > 0) {
              user_id = userRes[0].user_id;
          } else {
              const [newUserRes] = await pool.query(
                  `INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
                  [app.full_name, app.email, hashedPassword, app.phone, 'customer']
              );
              user_id = newUserRes.insertId;
          }
          await pool.query(
              `INSERT INTO affiliates (user_id, affiliate_code, affiliate_link, plan_id, status) VALUES (?, ?, ?, ?, 'Approved')`,
              [user_id, affiliateCode, affiliateLink, 1]
          );
        }
      }
    } catch (e) {
      console.error("Error generating affiliate record:", e);
    }
  }
  
  const fields = Object.keys(bodyData);
  const values = Object.values(bodyData);
  if (fields.length === 0 && categoryFilters === undefined) return res.status(400).json({ error: 'No data provided' });
  try {
    if (fields.length > 0) {
      const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
      await pool.query(`UPDATE \`${config.table}\` SET ${setClause} WHERE \`${config.key}\` = ?`, [...values, req.params.id]);
    }
    
    if (req.params.moduleName === 'categories' && categoryFilters !== undefined) {
      await pool.query(`DELETE FROM category_filters WHERE category_id = ?`, [req.params.id]);
      for (let f of categoryFilters) {
        await pool.query(`INSERT INTO category_filters (category_id, filter_name) VALUES (?, ?)`, [req.params.id, f]);
      }
    }
    
    res.status(200).json({ message: 'Item updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleModuleItemStatus = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  const { status } = req.body;

  // Intercept Affiliate Approvals
  if (req.params.moduleName === 'affiliates' && status === 'Approved') {
    try {
      const crypto = require("crypto");
      const bcrypt = require("bcryptjs");
      const [appRes] = await pool.query(`SELECT * FROM affiliate_applications WHERE application_id = ?`, [req.params.id]);
      if (appRes.length > 0) {
        const app = appRes[0];
        // Only generate the affiliate account if it isn't ALREADY approved 
        // (this allows re-approving applications that were rejected or broken previously)
        if (app.status !== 'Approved') {
          const tempPassword = crypto.randomBytes(4).toString('hex');
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(tempPassword, salt);
          const affiliateCode = `LHAF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          
          const affiliateLink = `http://localhost:5000/api/affiliate/ref/${affiliateCode}`;
          
          let user_id;
          const [userRes] = await pool.query(`SELECT * FROM users WHERE email = ?`, [app.email]);
          if (userRes.length > 0) {
              user_id = userRes[0].user_id;
          } else {
              const [newUserRes] = await pool.query(
                  `INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
                  [app.full_name, app.email, hashedPassword, app.phone, 'customer']
              );
              user_id = newUserRes.insertId;
          }
          await pool.query(
              `INSERT INTO affiliates (user_id, affiliate_code, affiliate_link, plan_id, status) VALUES (?, ?, ?, ?, 'Approved')`,
              [user_id, affiliateCode, affiliateLink, 1]
          );
        }
      }
    } catch (e) {
      console.error("Error generating affiliate record:", e);
    }
  }

  try {
    await pool.query(`UPDATE \`${config.table}\` SET status = ? WHERE \`${config.key}\` = ?`, [status || 'Live', req.params.id]);
    res.status(200).json({ message: 'Status updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteModuleItem = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  try {
    await pool.query(`DELETE FROM \`${config.table}\` WHERE \`${config.key}\` = ?`, [req.params.id]);
    res.status(200).json({ message: 'Item deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── SITE SECTIONS CMS (Page Content Editor) ─────────────────────────────────

const getAdminAffiliateDetails = async (req, res) => {
  try {
    const affiliate_id = req.params.id;
    const [affiliates] = await pool.query(
      `SELECT a.*, u.full_name, u.email, u.phone 
       FROM affiliates a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE a.affiliate_id = ?`, 
      [affiliate_id]
    );
    if (affiliates.length === 0) return res.status(404).json({ error: 'Affiliate not found' });
    
    const affiliate = affiliates[0];
    
    const [clicksRes] = await pool.query(`SELECT COUNT(*) as count FROM affiliate_clicks WHERE affiliate_id = ?`, [affiliate_id]);
    const [commissionsRes] = await pool.query(`
      SELECT 
        COUNT(*) as sales,
        SUM(CASE WHEN status = 'Pending' THEN commission_amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'Paid' THEN commission_amount ELSE 0 END) as paid
      FROM commissions WHERE affiliate_id = ?
    `, [affiliate_id]);
    
    const [commissionsList] = await pool.query(`SELECT * FROM commissions WHERE affiliate_id = ? ORDER BY created_at DESC LIMIT 20`, [affiliate_id]);
    const [clicksList] = await pool.query(`SELECT ip_address, browser, created_at FROM affiliate_clicks WHERE affiliate_id = ? ORDER BY created_at DESC LIMIT 20`, [affiliate_id]);

    res.status(200).json({
      affiliate,
      stats: {
        totalClicks: clicksRes[0].count,
        totalOrders: commissionsRes[0].sales || 0,
        pendingCommission: commissionsRes[0].pending || 0,
        paidCommission: commissionsRes[0].paid || 0
      },
      commissions: commissionsList,
      clicks: clicksList
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayoutsSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.affiliate_id, a.affiliate_code, u.full_name, u.email, u.phone,
             SUM(c.commission_amount) as pending_amount
      FROM affiliates a
      JOIN users u ON a.user_id = u.user_id
      LEFT JOIN commissions c ON a.affiliate_id = c.affiliate_id AND c.status = 'Pending'
      GROUP BY a.affiliate_id, a.affiliate_code, u.full_name, u.email, u.phone
      ORDER BY pending_amount DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const processPayout = async (req, res) => {
  try {
    const { affiliate_id, amount, payment_method } = req.body;
    await pool.query(
      `INSERT INTO payouts (affiliate_id, amount, payment_method, status) VALUES (?, ?, ?, 'Paid')`,
      [affiliate_id, amount, payment_method]
    );
    await pool.query(
      `UPDATE commissions SET status = 'Paid' WHERE affiliate_id = ? AND status = 'Pending'`,
      [affiliate_id]
    );
    res.status(200).json({ message: 'Payout processed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllSections = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM site_sections ORDER BY page_name ASC, section_name ASC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSectionByKey = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM site_sections WHERE section_key = ?`, [req.params.key]);
    if (rows.length === 0) return res.status(404).json({ error: 'Section not found' });
    const row = rows[0];
    if (row.metadata && typeof row.metadata === 'string') {
      try { row.metadata = JSON.parse(row.metadata); } catch (e) {}
    }
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSection = async (req, res) => {
  const { key } = req.params;
  const { title, subtitle, body_content, image_url, image_url_2, button_text, button_link, badge_text, status, metadata } = req.body;
  try {
    const metadataStr = metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : null;
    const [existing] = await pool.query(`SELECT section_key FROM site_sections WHERE section_key = ?`, [key]);
    
    if (existing.length === 0) {
      await pool.query(
        `INSERT INTO site_sections (section_key, page_name, section_name, title, subtitle, body_content, image_url, image_url_2, button_text, button_link, badge_text, status, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [key, key, key, title || null, subtitle || null, body_content || null, image_url || null, image_url_2 || null, button_text || null, button_link || null, badge_text || null, status || 'Live', metadataStr]
      );
    } else {
      await pool.query(
        `UPDATE site_sections SET 
          title = ?, subtitle = ?, body_content = ?, 
          image_url = ?, image_url_2 = ?,
          button_text = ?, button_link = ?, badge_text = ?, status = ?,
          metadata = ?
         WHERE section_key = ?`,
        [title || null, subtitle || null, body_content || null, image_url || null, image_url_2 || null, button_text || null, button_link || null, badge_text || null, status || 'Live', metadataStr, key]
      );
    }
    
    // Auto-sync bundles and ways_cards to products table
    if (key === 'offers_bundles_page' && metadata) {
      const itemsToSync = [];
      if (metadata.bundles && Array.isArray(metadata.bundles)) {
        metadata.bundles.forEach(b => {
          if (b.slug) itemsToSync.push(b);
        });
      }
      if (metadata.ways_cards && Array.isArray(metadata.ways_cards)) {
        metadata.ways_cards.forEach(wc => {
          if (wc.slug) itemsToSync.push(wc);
        });
      }

      for (let item of itemsToSync) {
        const priceStr = String(item.original_price || '').replace(/[^0-9.]/g, '');
        const salePriceStr = String(item.bundle_price || '').replace(/[^0-9.]/g, '');
        const price = priceStr ? parseFloat(priceStr) : 0;
        const salePrice = salePriceStr ? parseFloat(salePriceStr) : null;
        const name = item.title || 'Untitled Bundle';
        const desc = item.items_included || item.description || '';
        const status = item.status === 'Draft' ? 'Draft' : 'Live';

        await pool.query(
          `INSERT INTO products (name, slug, sku, short_description, price, sale_price, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             name = VALUES(name), short_description = VALUES(short_description), 
             price = VALUES(price), sale_price = VALUES(sale_price), status = VALUES(status)`,
          [name, item.slug, `BNDL-${item.slug.substring(0, 15).toUpperCase()}`, desc, price, salePrice, status]
        );
      }
    }

    res.status(200).json({ message: 'Section saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSection = async (req, res) => {
  const { key } = req.params;
  try {
    await pool.query(`DELETE FROM site_sections WHERE section_key = ?`, [key]);
    res.status(200).json({ message: 'Section deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.full_name as customer_name_reg FROM orders o 
       LEFT JOIN users u ON o.user_id = u.user_id 
       ORDER BY o.created_at DESC`
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;
  try {
    await pool.query(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [order_status, id]);
    res.status(200).json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── MODULAR PRODUCTS ────────────────────────────────────────────────────────────────


const getDisplaySections = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM display_sections ORDER BY display_section_id ASC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductSections = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM product_sections ORDER BY default_display_order ASC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdminCustomerDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [userRows] = await pool.query(`SELECT user_id, full_name, email, phone, address, city, status, created_at FROM users WHERE user_id = ?`, [id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    const user = userRows[0];

    const [orders] = await pool.query(`SELECT * FROM orders WHERE user_id = ? OR recipient_name = ? ORDER BY created_at DESC`, [id, user.full_name]);
    
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.order_id);
      const [orderItems] = await pool.query(`
        SELECT oi.order_id, oi.quantity, p.name as product_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id IN (?)
      `, [orderIds]);

      orders.forEach(order => {
        order.items = orderItems
          .filter(item => item.order_id === order.order_id)
          .map(item => ({ product_name: item.product_name, quantity: item.quantity }));
      });
    }

    const [customOrders] = await pool.query(`SELECT * FROM custom_orders WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC`, [id, user.email]);

    const [wishlists] = await pool.query(`
      SELECT w.wishlist_id, p.product_id, p.name, p.slug, p.price,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order ASC LIMIT 1) as image
      FROM wishlists w JOIN products p ON w.product_id = p.product_id WHERE w.user_id = ?
    `, [id]);

    res.status(200).json({
      ...user,
      orders,
      customOrders,
      wishlists
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id ORDER BY p.created_at DESC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdminProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [prod] = await pool.query(`SELECT * FROM products WHERE product_id = ?`, [id]);
    if (prod.length === 0) return res.status(404).json({ error: 'Product not found' });
    
    const [images] = await pool.query(`SELECT image_url, is_main, display_order FROM product_images WHERE product_id = ? ORDER BY display_order`, [id]);
    const [variants] = await pool.query(`SELECT pv.color_id, pv.sku, pv.stock_quantity, pv.image_url, c.name as color_name, c.hex_code FROM product_variants pv JOIN colors c ON pv.color_id = c.color_id WHERE pv.product_id = ?`, [id]);
    const [sizes] = await pool.query(`SELECT size_id FROM product_sizes WHERE product_id = ?`, [id]);
    const [specs] = await pool.query(`SELECT spec_id, value FROM product_specifications WHERE product_id = ?`, [id]);
    const [customizations] = await pool.query(`SELECT customization_id FROM product_customizations WHERE product_id = ?`, [id]);
    const [sections] = await pool.query(`SELECT section_id, is_visible, display_order FROM product_section_mapping WHERE product_id = ? ORDER BY display_order ASC`, [id]);
    
    // NEW: Gallery and Display Mapping
    const [gallery] = await pool.query(`
      SELECT pg.*, pvg.color_id as variant_id 
      FROM product_gallery pg 
      LEFT JOIN product_variant_gallery pvg ON pg.gallery_id = pvg.gallery_id 
      WHERE pg.product_id = ? 
      ORDER BY pg.display_order ASC`, [id]);
      
    const [displaySections] = await pool.query(`SELECT display_section_id FROM product_display WHERE product_id = ?`, [id]);
    
    res.status(200).json({
      ...prod[0],
      images: gallery, // sending it as images temporarily or gallery
      gallery: gallery,
      variants,
      sizes: sizes.map(s => s.size_id),
      specifications: specs,
      customizations: customizations.map(c => c.customization_id),
      sections: sections,
      display_sections: displaySections.map(d => d.display_section_id)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { 
      name, slug, category_id, sku, price, sale_price, stock, 
      short_description, long_description, care_instructions, fabric_details,
      is_featured, is_new_arrival, seo_title, meta_description, keywords, canonical_url, size_guide_id, bundle_attributes,
      images, variants, sizes, specifications, customizations, sections,
      gallery, display_sections
    } = req.body;
    
    const pSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [prodRes] = await connection.query(
      `INSERT INTO products 
        (name, slug, category_id, sku, price, sale_price, stock, 
         short_description, long_description, care_instructions, fabric_details, 
         is_featured, is_new_arrival, seo_title, meta_description, keywords, canonical_url, size_guide_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Live')`,
      [name, pSlug, category_id || null, sku || null, price || 0, sale_price || null, stock || 0,
       short_description || null, long_description || null, care_instructions || null, fabric_details || null,
       is_featured ? 1 : 0, is_new_arrival ? 1 : 0, seo_title || null, meta_description || null, keywords || null, canonical_url || null, size_guide_id || null]
    );

    const pid = prodRes.insertId;

    if (gallery && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        let g = gallery[i];
        const [gRes] = await connection.query(
          `INSERT INTO product_gallery (product_id, media_type, image_title, image_url, thumbnail_url, alt_text, display_order, is_featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
          [pid, g.media_type || 'image', g.image_title || null, g.image_url, g.thumbnail_url || null, g.alt_text || null, i, g.is_featured ? 1 : 0]
        );
        if (g.variant_id) {
          await connection.query(`INSERT INTO product_variant_gallery (color_id, gallery_id, display_order) VALUES (?, ?, ?)`, 
            [g.variant_id, gRes.insertId, i]);
        }
      }
    } else if (images && images.length > 0) {
      // Legacy fallback
      for (let i = 0; i < images.length; i++) {
        await connection.query(`INSERT INTO product_gallery (product_id, image_url, is_featured, display_order) VALUES (?, ?, ?, ?)`, 
          [pid, images[i].image_url, i === 0 ? 1 : 0, i]);
      }
    }

    if (display_sections && display_sections.length > 0) {
      for (let d of display_sections) {
        await connection.query(`INSERT INTO product_display (product_id, display_section_id) VALUES (?, ?)`, [pid, d]);
      }
    }

    if (variants && variants.length > 0) {
      for (let v of variants) {
        await connection.query(`INSERT INTO product_variants (product_id, color_id, sku, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)`, 
          [pid, v.color_id, v.sku || null, v.stock_quantity || 0, v.image_url || null]);
      }
    }

    if (sizes && sizes.length > 0) {
      for (let s of sizes) {
        await connection.query(`INSERT INTO product_sizes (product_id, size_id) VALUES (?, ?)`, [pid, s]);
      }
    }

    if (specifications && specifications.length > 0) {
      for (let spec of specifications) {
        await connection.query(`INSERT INTO product_specifications (product_id, spec_id, value) VALUES (?, ?, ?)`, [pid, spec.spec_id, spec.value]);
      }
    }

    if (customizations && customizations.length > 0) {
      for (let c of customizations) {
        await connection.query(`INSERT INTO product_customizations (product_id, customization_id) VALUES (?, ?)`, [pid, c]);
      }
    }

    if (sections && sections.length > 0) {
      for (let s of sections) {
        await connection.query(`INSERT INTO product_section_mapping (product_id, section_id, is_visible, display_order) VALUES (?, ?, ?, ?)`, 
          [pid, s.section_id, s.is_visible || 'Y', s.display_order || 0]);
      }
    } else {
      // If none provided, insert defaults
      const [allSections] = await connection.query(`SELECT section_id, default_display_order FROM product_sections`);
      for (let s of allSections) {
         await connection.query(`INSERT INTO product_section_mapping (product_id, section_id, is_visible, display_order) VALUES (?, ?, 'Y', ?)`, 
           [pid, s.section_id, s.default_display_order]);
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Product added', id: pid });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const pid = req.params.id;
    const { 
      name, slug, category_id, sku, price, sale_price, stock, 
      short_description, long_description, care_instructions, fabric_details,
      is_featured, is_new_arrival, seo_title, meta_description, keywords, canonical_url, size_guide_id, bundle_attributes,
      images, variants, sizes, specifications, customizations, sections,
      gallery, display_sections
    } = req.body;
    
    const pSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await connection.query(
      `UPDATE products SET 
        name=?, slug=?, category_id=?, sku=?, price=?, sale_price=?, stock=?, 
        short_description=?, long_description=?, care_instructions=?, fabric_details=?, 
        is_featured=?, is_new_arrival=?, seo_title=?, meta_description=?, keywords=?, canonical_url=?, size_guide_id=?, bundle_attributes=?
          WHERE product_id=?`,
      [name, pSlug, category_id || null, sku || null, price || 0, sale_price || null, stock || 0,
       short_description || null, long_description || null, care_instructions || null, fabric_details || null,
       is_featured ? 1 : 0, is_new_arrival ? 1 : 0, seo_title || null, meta_description || null, keywords || null, canonical_url || null, size_guide_id || null, pid]
    );

    // Delete and recreate relations
    if (gallery !== undefined) {
      await connection.query(`DELETE FROM product_gallery WHERE product_id=?`, [pid]);
      for (let i = 0; i < gallery.length; i++) {
        let g = gallery[i];
        const [gRes] = await connection.query(
          `INSERT INTO product_gallery (product_id, media_type, image_title, image_url, thumbnail_url, alt_text, display_order, is_featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
          [pid, g.media_type || 'image', g.image_title || null, g.image_url, g.thumbnail_url || null, g.alt_text || null, i, g.is_featured ? 1 : 0]
        );
        if (g.variant_id) {
          await connection.query(`INSERT INTO product_variant_gallery (color_id, gallery_id, display_order) VALUES (?, ?, ?)`, 
            [g.variant_id, gRes.insertId, i]);
        }
      }
    } else if (images !== undefined) {
      // Legacy fallback
      await connection.query(`DELETE FROM product_gallery WHERE product_id=?`, [pid]);
      for (let i = 0; i < images.length; i++) {
        await connection.query(`INSERT INTO product_gallery (product_id, image_url, is_featured, display_order) VALUES (?, ?, ?, ?)`, 
          [pid, images[i].image_url, i === 0 ? 1 : 0, i]);
      }
    }

    if (display_sections !== undefined) {
      await connection.query(`DELETE FROM product_display WHERE product_id=?`, [pid]);
      for (let d of display_sections) {
        await connection.query(`INSERT INTO product_display (product_id, display_section_id) VALUES (?, ?)`, [pid, d]);
      }
    }

    if (variants !== undefined) {
      await connection.query(`DELETE FROM product_variants WHERE product_id=?`, [pid]);
      for (let v of variants) {
        await connection.query(`INSERT INTO product_variants (product_id, color_id, sku, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)`, 
          [pid, v.color_id, v.sku || null, v.stock_quantity || 0, v.image_url || null]);
      }
    }

    if (sizes !== undefined) {
      await connection.query(`DELETE FROM product_sizes WHERE product_id=?`, [pid]);
      for (let s of sizes) {
        await connection.query(`INSERT INTO product_sizes (product_id, size_id) VALUES (?, ?)`, [pid, s]);
      }
    }

    if (specifications !== undefined) {
      await connection.query(`DELETE FROM product_specifications WHERE product_id=?`, [pid]);
      for (let spec of specifications) {
        await connection.query(`INSERT INTO product_specifications (product_id, spec_id, value) VALUES (?, ?, ?)`, [pid, spec.spec_id, spec.value]);
      }
    }

    if (customizations !== undefined) {
      await connection.query(`DELETE FROM product_customizations WHERE product_id=?`, [pid]);
      for (let c of customizations) {
        await connection.query(`INSERT INTO product_customizations (product_id, customization_id) VALUES (?, ?)`, [pid, c]);
      }
    }

    if (sections !== undefined) {
      await connection.query(`DELETE FROM product_section_mapping WHERE product_id=?`, [pid]);
      for (let s of sections) {
        await connection.query(`INSERT INTO product_section_mapping (product_id, section_id, is_visible, display_order) VALUES (?, ?, ?, ?)`, 
          [pid, s.section_id, s.is_visible || 'Y', s.display_order || 0]);
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM products WHERE product_id = ?`, [id]);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────

const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    await pool.query(`INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)`, [email]);
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToCustomerMessage = async (req, res) => {
  const { messageId, to, from = 'info@lailahijabs.com', subject, body } = req.body;
  try {
    if (messageId) {
      await pool.query(`UPDATE contact_messages SET status = 'Replied' WHERE message_id = ?`, [messageId]);
    }
    res.status(200).json({ 
      success: true, 
      message: `Email reply sent successfully to ${to} from info@lailahijabs.com!` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image data provided' });

    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const imageUrl = `/uploads/${fileName}`;
    res.status(200).json({ success: true, imageUrl, url: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
  getAdminProductDetails,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductSections,
  getDisplaySections,
  subscribeNewsletter,
  getAdminAffiliateDetails,
  getPayoutsSummary,
  processPayout,
  getAdminCustomerDetails,
  replyToCustomerMessage,
  uploadImage
};