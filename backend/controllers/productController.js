const { pool } = require('../config/db');

// Helper to parse JSON fields safely
const parseJsonField = (field, fallback = []) => {
  if (!field) return fallback;
  if (typeof field === 'object') return field;
  try {
    return JSON.parse(field);
  } catch (e) {
    return fallback;
  }
};

// 1. Get products
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, badge } = req.query;
    let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug 
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.category_id 
               WHERE 1=1`;
    const params = [];

    if (category) {
      sql += ` AND (c.slug = ? OR UPPER(c.name) = UPPER(?))`;
      params.push(category, category);
    }
    if (featured === 'true' || featured === '1') {
      sql += ` AND p.is_featured = 1`;
    }
    if (badge) {
      sql += ` AND p.badge = ?`;
      params.push(badge);
    }
    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.fabric_type LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(sql, params);

    const formatted = rows.map(prod => ({
      id: prod.product_id,
      product_id: prod.product_id,
      name: prod.name,
      slug: prod.slug,
      category: prod.category_name || 'ABAYAS',
      category_slug: prod.category_slug,
      price: parseFloat(prod.price),
      compare_at_price: prod.compare_at_price ? parseFloat(prod.compare_at_price) : null,
      description: prod.description,
      image: prod.image_url,
      image_url: prod.image_url,
      thumbnails: parseJsonField(prod.thumbnails, [prod.image_url]),
      badge: prod.badge,
      fitType: prod.fit_type,
      color: prod.color,
      colorSwatches: parseJsonField(prod.color_swatches, [{ name: prod.color || "Black", hex: "#000000" }]),
      sizes: parseJsonField(prod.sizes, ["XXS", "XS", "S", "M", "L", "XL", "XXL"]),
      material: prod.fabric_type,
      fabric: prod.fabric_type,
      stock_quantity: prod.stock_quantity,
      is_featured: prod.is_featured === 1
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Get single product by slug/id with reviews
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE p.slug = ? OR p.product_id = ?`,
      [slug, slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const prod = rows[0];

    const [reviews] = await pool.query(
      `SELECT review_id, reviewer_name, rating, title, comment, created_at 
       FROM product_reviews 
       WHERE product_id = ? AND status = 'Live' 
       ORDER BY created_at DESC`,
      [prod.product_id]
    );

    const formatted = {
      id: prod.product_id,
      product_id: prod.product_id,
      name: prod.name,
      slug: prod.slug,
      category: prod.category_name || 'ABAYAS',
      category_slug: prod.category_slug,
      price: parseFloat(prod.price),
      compare_at_price: prod.compare_at_price ? parseFloat(prod.compare_at_price) : null,
      description: prod.description,
      image: prod.image_url,
      image_url: prod.image_url,
      thumbnails: parseJsonField(prod.thumbnails, [prod.image_url]),
      badge: prod.badge,
      fitType: prod.fit_type,
      color: prod.color,
      colorSwatches: parseJsonField(prod.color_swatches, [{ name: prod.color || "Black", hex: "#000000" }]),
      sizes: parseJsonField(prod.sizes, ["XXS", "XS", "S", "M", "L", "XL", "XXL"]),
      material: prod.fabric_type,
      fabric: prod.fabric_type,
      stock_quantity: prod.stock_quantity,
      is_featured: prod.is_featured === 1,
      reviews: reviews
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting product details:', err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Get all categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Create Order (Checkout)
const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, recipient_name, recipient_phone, items, total_amount, shipping_address, city, postal_code, payment_method } = req.body;

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, recipient_name, recipient_phone, total_amount, shipping_address, city, postal_code, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, recipient_name, recipient_phone, total_amount, shipping_address, city || null, postal_code || null, payment_method || 'COD']
    );

    const orderId = orderResult.insertId;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, selected_color, selected_size) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id || item.id, item.quantity || 1, item.price, item.color || null, item.size || null]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully!', orderId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// 5. Submit Custom Bespoke Design Order (CustomOrdersPage.jsx)
const submitCustomOrder = async (req, res) => {
  const { customer_name, customer_email, customer_phone, garment_type, fabric_choice, custom_color, bust_size, waist_size, hip_size, sleeve_length, total_height, notes, reference_image_url } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO custom_orders (customer_name, customer_email, customer_phone, garment_type, fabric_choice, custom_color, bust_size, waist_size, hip_size, sleeve_length, total_height, notes, reference_image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_name, customer_email, customer_phone, garment_type, fabric_choice || null, custom_color || null, bust_size || null, waist_size || null, hip_size || null, sleeve_length || null, total_height || null, notes || null, reference_image_url || null]
    );

    res.status(201).json({ message: 'Bespoke custom order submitted successfully!', customOrderId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Submit Affiliate Partner Application (Affiliatepage.jsx)
const submitAffiliateApplication = async (req, res) => {
  const { full_name, email, phone, instagram_handle, tiktok_handle, website_url, country, promo_strategy } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO affiliate_applications (full_name, email, phone, instagram_handle, tiktok_handle, website_url, country, promo_strategy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone || null, instagram_handle || null, tiktok_handle || null, website_url || null, country || null, promo_strategy || null]
    );

    res.status(201).json({ message: 'Affiliate application submitted successfully!', applicationId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Submit Contact Inquiry (ContactUs.jsx)
const submitContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({ message: 'Contact message sent successfully!', messageId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Fetch Active Special Offers (OffersPage.jsx)
const getActiveOffers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM offers WHERE status = 'Active' ORDER BY created_at DESC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Fetch Store Locations (LocationDetailPage.jsx)
const getStoreLocations = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM store_locations WHERE status = 'Active' ORDER BY city ASC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. Fetch Blogs and Comments (BlogsPage.jsx)
const getBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM blogs WHERE status = 'Live' ORDER BY is_featured DESC, created_at DESC`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getProducts, 
  getProductBySlug, 
  getCategories, 
  createOrder, 
  submitCustomOrder, 
  submitAffiliateApplication, 
  submitContactMessage, 
  getActiveOffers, 
  getStoreLocations, 
  getBlogs 
};
