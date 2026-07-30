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
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createModuleItem = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  let bodyData = { ...req.body };
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
    res.status(201).json({ message: 'Item created!', id: result.insertId });
  } catch (err) {
    console.error("createModuleItem error:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateModuleItem = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
  try {
    const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
    await pool.query(`UPDATE \`${config.table}\` SET ${setClause} WHERE \`${config.key}\` = ?`, [...values, req.params.id]);
    res.status(200).json({ message: 'Item updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleModuleItemStatus = async (req, res) => {
  const config = TABLE_MAP[req.params.moduleName];
  if (!config) return res.status(400).json({ error: 'Invalid module' });
  const { status } = req.body;
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
  const { title, subtitle, body_content, image_url, image_url_2, button_text, button_link, badge_text, metadata } = req.body;
  try {
    const metadataStr = metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : null;
    const [existing] = await pool.query(`SELECT section_key FROM site_sections WHERE section_key = ?`, [key]);
    
    if (existing.length === 0) {
      await pool.query(
        `INSERT INTO site_sections (section_key, title, subtitle, body_content, image_url, image_url_2, button_text, button_link, badge_text, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [key, title || null, subtitle || null, body_content || null, image_url || null, image_url_2 || null, button_text || null, button_link || null, badge_text || null, metadataStr]
      );
    } else {
      await pool.query(
        `UPDATE site_sections SET 
          title = ?, subtitle = ?, body_content = ?, 
          image_url = ?, image_url_2 = ?,
          button_text = ?, button_link = ?, badge_text = ?,
          metadata = ?
         WHERE section_key = ?`,
        [title || null, subtitle || null, body_content || null, image_url || null, image_url_2 || null, button_text || null, button_link || null, badge_text || null, metadataStr, key]
      );
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

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id ORDER BY p.created_at DESC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  const { name, price, category_id, fabric_type, description, image_url, stock_quantity, badge, color, sizes, color_swatches, thumbnails } = req.body;
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const [result] = await pool.query(
      `INSERT INTO products (name, slug, price, category_id, fabric_type, description, image_url, stock_quantity, badge, color, sizes, color_swatches, thumbnails, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Live')`,
      [name, slug, price || 0, category_id || 1, fabric_type || 'Premium Nida', description || null, image_url || null, stock_quantity || 0, badge || 'NEW IN', color || 'Black',
       sizes ? JSON.stringify(sizes) : '["S","M","L","XL"]',
       color_swatches ? JSON.stringify(color_swatches) : null,
       thumbnails ? JSON.stringify(thumbnails) : null]
    );
    res.status(201).json({ message: 'Product added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
  try {
    const setClause = fields.map(f => `\`${f}\` = ?`).join(', ');
    await pool.query(`UPDATE products SET ${setClause} WHERE product_id = ?`, [...values, id]);
    res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  addProduct,
  updateProduct,
  deleteProduct,
  subscribeNewsletter
};