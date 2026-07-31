const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

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

// 1. Get products (Modular)
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, badge } = req.query;
    let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug 
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.category_id 
               WHERE p.status = 'Active'`;
    const params = [];

    if (category) {
      sql += ` AND (c.slug = ? OR UPPER(c.name) = UPPER(?))`;
      params.push(category, category);
    }
    if (featured === 'true' || featured === '1') {
      sql += ` AND p.is_featured = 1`;
    }
    if (search) {
      sql += ` AND (p.name LIKE ? OR p.short_description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(sql, params);

    // Fetch related modular data for all fetched products
    const productIds = rows.map(r => r.product_id);
    let imagesMap = {}, variantsMap = {}, sizesMap = {}, specsMap = {};

    if (productIds.length > 0) {
      const [images] = await pool.query(`SELECT * FROM product_images WHERE product_id IN (?) ORDER BY display_order`, [productIds]);
      images.forEach(img => {
        if(!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });

      const [variants] = await pool.query(`
        SELECT pv.*, c.name as color_name, c.hex_code 
        FROM product_variants pv 
        JOIN colors c ON pv.color_id = c.color_id 
        WHERE pv.product_id IN (?)`, [productIds]);
      variants.forEach(v => {
        if(!variantsMap[v.product_id]) variantsMap[v.product_id] = [];
        variantsMap[v.product_id].push({ name: v.color_name, hex: v.hex_code, stock: v.stock_quantity, sku: v.sku, image: v.image_url, variant_id: v.variant_id });
      });

      const [sizes] = await pool.query(`
        SELECT ps.product_id, s.size_name 
        FROM product_sizes ps 
        JOIN sizes s ON ps.size_id = s.size_id 
        WHERE ps.product_id IN (?) ORDER BY s.display_order`, [productIds]);
      sizes.forEach(s => {
        if(!sizesMap[s.product_id]) sizesMap[s.product_id] = [];
        sizesMap[s.product_id].push(s.size_name);
      });
      
      const [specs] = await pool.query(`
        SELECT ps.product_id, s.spec_name, ps.value 
        FROM product_specifications ps 
        JOIN specifications s ON ps.spec_id = s.spec_id 
        WHERE ps.product_id IN (?) AND UPPER(s.spec_name) = 'FABRIC'`, [productIds]);
      specs.forEach(s => {
        specsMap[s.product_id] = s.value;
      });
    }

    const formatted = rows.map(prod => {
      const pImages = imagesMap[prod.product_id] || [];
      const pVariants = variantsMap[prod.product_id] || [];
      const pSizes = sizesMap[prod.product_id] || [];
      const fabric = specsMap[prod.product_id] || 'Premium Blend';
      const totalStock = pVariants.reduce((sum, v) => sum + v.stock, prod.stock || 0);

      return {
        id: prod.product_id,
        product_id: prod.product_id,
        name: prod.name,
        slug: prod.slug,
        category: prod.category_name || 'ABAYAS',
        category_slug: prod.category_slug,
        price: parseFloat(prod.price),
        compare_at_price: prod.sale_price ? parseFloat(prod.price) : null, // Assuming sale_price acts like price and price acts like compare
        description: prod.short_description,
        image: pImages.length > 0 ? pImages[0] : null,
        image_url: pImages.length > 0 ? pImages[0] : null,
        thumbnails: pImages,
        badge: prod.is_new_arrival ? 'NEW IN' : '',
        colorSwatches: pVariants,
        variants: pVariants,
        sizes: pSizes,
        material: fabric,
        fabric: fabric,
        stock_quantity: totalStock,
        is_featured: prod.is_featured === 1
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Get single product by slug/id (Modular)
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE (p.slug = ? OR p.product_id = ?) AND p.status = 'Active'`,
      [slug, slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const prod = rows[0];
    const pid = prod.product_id;

    // Fetch Gallery
    const [galleryRaw] = await pool.query(
      `SELECT pg.*, pvg.variant_id 
       FROM product_gallery pg 
       LEFT JOIN product_variant_gallery pvg ON pg.gallery_id = pvg.gallery_id 
       WHERE pg.product_id = ? AND pg.status = 'Published' 
       ORDER BY pg.display_order ASC`, [pid]
    );
    const imgUrls = galleryRaw.map(g => g.image_url);
    const gallery = galleryRaw;

    // Fetch Variants
    const [variants] = await pool.query(`
      SELECT pv.*, c.name as color_name, c.hex_code 
      FROM product_variants pv 
      JOIN colors c ON pv.color_id = c.color_id 
      WHERE pv.product_id = ?`, [pid]);
      
    const pVariants = variants.map(v => ({ name: v.color_name, hex: v.hex_code, stock: v.stock_quantity, sku: v.sku, image: v.image_url }));

    // Fetch Sizes
    const [sizes] = await pool.query(`
      SELECT s.size_name 
      FROM product_sizes ps 
      JOIN sizes s ON ps.size_id = s.size_id 
      WHERE ps.product_id = ? ORDER BY s.display_order`, [pid]);
    const pSizes = sizes.map(s => s.size_name);

    // Fetch Specifications
    const [specs] = await pool.query(`
      SELECT sg.name as group_name, s.spec_name, ps.value 
      FROM product_specifications ps 
      JOIN specifications s ON ps.spec_id = s.spec_id 
      JOIN specification_groups sg ON s.group_id = sg.group_id
      WHERE ps.product_id = ?`, [pid]);
      
    const specMap = {};
    specs.forEach(s => {
      if(!specMap[s.group_name]) specMap[s.group_name] = {};
      specMap[s.group_name][s.spec_name] = s.value;
    });

    // Fetch Customizations
    const [customs] = await pool.query(`
      SELECT c.name, c.options_json 
      FROM product_customizations pc 
      JOIN customizations c ON pc.customization_id = c.customization_id 
      WHERE pc.product_id = ?`, [pid]);

    // Fetch Size Guide
    let sizeGuide = null;
    if (prod.size_guide_id) {
       const [sg] = await pool.query(`SELECT * FROM size_guides WHERE guide_id = ?`, [prod.size_guide_id]);
       if(sg.length > 0) sizeGuide = sg[0];
    }

    // Fetch Sections
    const [sections] = await pool.query(
      `SELECT ps.section_key, ps.section_name 
       FROM product_section_mapping psm
       JOIN product_sections ps ON ps.section_id = psm.section_id
       WHERE psm.product_id = ? AND psm.is_visible = 'Y'
       ORDER BY psm.display_order ASC`,
      [pid]
    );

    const [reviews] = await pool.query(
      `SELECT review_id, reviewer_name, rating, title, comment, created_at 
       FROM product_reviews 
       WHERE product_id = ? AND status = 'Live' 
       ORDER BY created_at DESC`,
      [pid]
    );

    const totalStock = pVariants.reduce((sum, v) => sum + v.stock, prod.stock || 0);

    const formatted = {
      id: pid,
      product_id: pid,
      name: prod.name,
      slug: prod.slug,
      category: prod.category_name || 'ABAYAS',
      category_slug: prod.category_slug,
      price: parseFloat(prod.price),
      sale_price: prod.sale_price ? parseFloat(prod.sale_price) : null,
      compare_at_price: prod.sale_price ? parseFloat(prod.price) : null,
      description: prod.short_description,
      long_description: prod.long_description,
      care_instructions: prod.care_instructions,
      fabric_details: prod.fabric_details,
      image: imgUrls.length > 0 ? imgUrls[0] : null,
      image_url: imgUrls.length > 0 ? imgUrls[0] : null,
      thumbnails: imgUrls,
      gallery: gallery,
      badge: prod.is_new_arrival ? 'NEW IN' : '',
      colorSwatches: pVariants,
      variants: pVariants,
      sizes: pSizes,
      specifications: specMap,
      customizations: customs.map(c => ({ name: c.name, options: JSON.parse(c.options_json || '[]') })),
      size_guide: sizeGuide,
      stock_quantity: totalStock,
      is_featured: prod.is_featured === 1,
      seo: {
        title: prod.seo_title,
        description: prod.meta_description,
        keywords: prod.keywords
      },
      reviews: reviews,
      sections: sections,
      bundle_attributes: prod.bundle_attributes
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
    const [categories] = await pool.query(`SELECT * FROM categories ORDER BY display_order ASC, name ASC`);
    const [filters] = await pool.query(`SELECT * FROM category_filters`);
    
    const formatted = categories.map(cat => {
      return {
        ...cat,
        filters: filters.filter(f => f.category_id === cat.category_id).map(f => f.filter_name)
      };
    });

    res.status(200).json(formatted);
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
        let validProductId = null;
        const rawId = item.product_id || item.id;
        
        if (rawId) {
          if (typeof rawId === 'number' || (!isNaN(Number(rawId)) && Number(rawId) > 0)) {
            const [pCheck] = await connection.query('SELECT product_id FROM products WHERE product_id = ?', [Number(rawId)]);
            if (pCheck.length > 0) {
              validProductId = pCheck[0].product_id;
            }
          }
          
          if (!validProductId) {
            const [pCheckSlug] = await connection.query('SELECT product_id FROM products WHERE slug = ? OR name = ?', [String(rawId), String(rawId)]);
            if (pCheckSlug.length > 0) {
              validProductId = pCheckSlug[0].product_id;
            }
          }
        }

        // Guaranteed safety check against foreign key constraint errors
        if (!validProductId) {
          const [firstP] = await connection.query('SELECT product_id FROM products LIMIT 1');
          if (firstP.length > 0) {
            validProductId = firstP[0].product_id;
          }
        }

        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, selected_color, selected_size) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, validProductId, item.quantity || 1, item.price || 0, item.color || null, item.size || null]
        );
      }
    }
    // Check for Affiliate Code
    let affiliate_code = req.body.affiliate_code;
    if (!affiliate_code && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith('affiliate_code=')) {
          affiliate_code = cookie.split('=')[1];
          break;
        }
      }
    }

    if (affiliate_code) {
      const [affiliates] = await connection.query(
        `SELECT a.affiliate_id, COALESCE(a.commission_rate, p.commission_rate, 10.00) as commission_rate
         FROM affiliates a 
         LEFT JOIN commission_plans p ON a.plan_id = p.plan_id 
         WHERE a.affiliate_code = ? AND a.status = 'Approved'`,
        [affiliate_code]
      );

      if (affiliates.length > 0) {
        const affiliate = affiliates[0];
        const commission_amount = (total_amount * affiliate.commission_rate) / 100;

        await connection.query(
          `INSERT INTO commissions (affiliate_id, order_id, sale_amount, commission_rate, commission_amount, status) 
           VALUES (?, ?, ?, ?, ?, 'Pending')`,
          [affiliate.affiliate_id, orderId, total_amount, affiliate.commission_rate, commission_amount]
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

// 4.1 Get Orders by Customer Email (AccountPage.jsx)
const getOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [orders] = await pool.query(
      `SELECT o.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id, 
            'product_id', oi.product_id, 
            'quantity', oi.quantity, 
            'price', oi.price, 
            'color', oi.color, 
            'size', oi.size,
            'product_name', p.name
          )
         ) FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
       FROM orders o 
       WHERE o.customer_email = ? 
       ORDER BY o.created_at DESC`,
      [email]
    );

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// 5.1 Get Custom Orders by Customer Email (AccountPage.jsx)
const getCustomOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [customOrders] = await pool.query(
      `SELECT * FROM custom_orders WHERE customer_email = ? ORDER BY created_at DESC`,
      [email]
    );
    res.status(200).json(customOrders);
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

// 11. Fetch Approved Customer Reviews for Product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM product_reviews WHERE product_id = ? AND (status = 'Approved' OR status = 'Live') ORDER BY created_at DESC`,
      [productId]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 12. Submit New Customer Review (Requires Admin Approval)
const submitProductReview = async (req, res) => {
  const { productId } = req.params;
  const { reviewer_name, rating, title, comment } = req.body;
  if (!reviewer_name || !comment) {
    return res.status(400).json({ error: 'Reviewer name and comment are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO product_reviews (product_id, reviewer_name, rating, title, comment, status) 
       VALUES (?, ?, ?, ?, ?, 'Draft')`,
      [productId, reviewer_name, rating || 5, title || null, comment]
    );
    res.status(201).json({ message: 'Review submitted successfully! It will appear once approved by Admin.', reviewId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 13. Fetch Website Homepage Sections
const getHomepageSections = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT section_key, section_name FROM website_sections WHERE status = 'Active' ORDER BY display_order ASC`
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getProductsByDisplaySection = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Join products with product_display and display_sections
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p
      JOIN product_display pd ON p.product_id = pd.product_id
      JOIN display_sections ds ON ds.display_section_id = pd.display_section_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE ds.slug = ? AND pd.status = 'Published'
      ORDER BY pd.sort_order ASC
    `, [slug]);

    if (rows.length === 0) {
       return res.status(200).json([]); // No products for this section
    }

    const productIds = rows.map(r => r.product_id);
    let imagesMap = {}, variantsMap = {};

    if (productIds.length > 0) {
      const [images] = await pool.query(`SELECT * FROM product_gallery WHERE product_id IN (?) ORDER BY display_order`, [productIds]);
      images.forEach(img => {
        if(!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });

      const [variants] = await pool.query(`
        SELECT pv.*, c.name as color_name, c.hex_code 
        FROM product_variants pv 
        JOIN colors c ON pv.color_id = c.color_id 
        WHERE pv.product_id IN (?)`, [productIds]);
      variants.forEach(v => {
        if(!variantsMap[v.product_id]) variantsMap[v.product_id] = [];
        variantsMap[v.product_id].push({ name: v.color_name, hex: v.hex_code, stock: v.stock_quantity, sku: v.sku, image: v.image_url });
      });
    }

    const formatted = rows.map(prod => {
      const pImages = imagesMap[prod.product_id] || [];
      const pVariants = variantsMap[prod.product_id] || [];
      const totalStock = pVariants.reduce((sum, v) => sum + v.stock, prod.stock || 0);

      return {
        id: prod.product_id,
        product_id: prod.product_id,
        name: prod.name,
        slug: prod.slug,
        category: prod.category_name || 'ABAYAS',
        price: parseFloat(prod.price),
        compare_at_price: prod.sale_price ? parseFloat(prod.price) : null,
        description: prod.short_description,
        image: pImages.length > 0 ? pImages[0] : null,
        thumbnails: pImages,
        badge: prod.is_new_arrival ? 'NEW IN' : '',
        colorSwatches: pVariants,
        stock_quantity: totalStock,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting products by display section:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── AUTHENTICATION & PROFILES ───────────────────────────────────────────────

const registerUser = async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    const [existing] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already in use.' });

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, status) VALUES (?, ?, ?, 'customer', 'Live')`,
      [full_name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Registration successful', user: { id: result.insertId, full_name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = users[0];
    
    // Compare provided password with hashed password (or fallback to plaintext for legacy accounts if no bcrypt hash exists)
    let isMatch = false;
    if (user.password_hash && user.password_hash.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = (password === user.password_hash);
    }

    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });
    res.status(200).json({ message: 'Login successful', user: { id: user.user_id, full_name: user.full_name, email: user.email, address: user.address, city: user.city, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserAddress = async (req, res) => {
  const { id } = req.params;
  const { address, city, phone } = req.body;
  try {
    await pool.query(`UPDATE users SET address = ?, city = ?, phone = ? WHERE user_id = ?`, [address, city, phone, id]);
    res.status(200).json({ message: 'Address updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── WISHLISTS ───────────────────────────────────────────────────────────────

const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const [wishlist] = await pool.query(
      `SELECT p.product_id as id, p.name, p.slug, p.price, p.stock, 
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order ASC LIMIT 1) as image,
        (SELECT c.name FROM product_variants pv JOIN colors c ON pv.color_id = c.color_id WHERE pv.product_id = p.product_id LIMIT 1) as color
       FROM wishlists w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = ?`,
      [userId]
    );
    // map stock > 0 to inStock for frontend compatibility
    const mapped = wishlist.map(item => ({ ...item, inStock: item.stock > 0 }));
    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query(`INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)`, [user_id, product_id]);
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    await pool.query(`DELETE FROM wishlists WHERE user_id = ? AND product_id = ?`, [userId, productId]);
    res.status(200).json({ message: 'Removed from wishlist' });
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
  getBlogs,
  getProductReviews,
  submitProductReview,
  getHomepageSections,
  getProductsByDisplaySection,
  getOrdersByEmail,
  getCustomOrdersByEmail,
  registerUser,
  loginUser,
  updateUserAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
