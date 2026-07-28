// models/schema.js

const createTables = [
  // 1. Categories Table
  `CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 2. Users Table
  `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3. Products Table
  `CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2) DEFAULT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    thumbnails JSON DEFAULT NULL,
    badge VARCHAR(50) DEFAULT 'NEW IN',
    fit_type VARCHAR(50) DEFAULT 'Regular Fit',
    color VARCHAR(50) DEFAULT 'Black',
    color_swatches JSON DEFAULT NULL,
    sizes JSON DEFAULT NULL,
    fabric_type VARCHAR(100) DEFAULT 'Premium Nida',
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    is_featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 4. Product Reviews Table
  `CREATE TABLE IF NOT EXISTS product_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT,
    reviewer_name VARCHAR(100) NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(150),
    comment TEXT,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 5. Wishlist Table
  `CREATE TABLE IF NOT EXISTS wishlists (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY user_product_unique (user_id, product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 6. Orders Table
  `CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    shipping_address TEXT NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'COD',
    tracking_number VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 7. Order Items Table
  `CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    quantity INT DEFAULT 1 NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    selected_color VARCHAR(50),
    selected_size VARCHAR(20),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 8. Custom Design Orders Table
  `CREATE TABLE IF NOT EXISTS custom_orders (
    custom_order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    garment_type VARCHAR(100) NOT NULL,
    fabric_choice VARCHAR(100),
    custom_color VARCHAR(50),
    bust_size VARCHAR(20),
    waist_size VARCHAR(20),
    hip_size VARCHAR(20),
    sleeve_length VARCHAR(20),
    total_height VARCHAR(20),
    notes TEXT,
    reference_image_url VARCHAR(500),
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 9. Affiliate Applications Table
  `CREATE TABLE IF NOT EXISTS affiliate_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    instagram_handle VARCHAR(100),
    tiktok_handle VARCHAR(100),
    website_url VARCHAR(255),
    country VARCHAR(100),
    promo_strategy TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 10. Special Offers Table
  `CREATE TABLE IF NOT EXISTS offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(500),
    valid_until DATE,
    status ENUM('Active', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 11. Store Locations Table
  `CREATE TABLE IF NOT EXISTS store_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    opening_hours VARCHAR(150),
    map_url VARCHAR(500),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 12. Blogs Table
  `CREATE TABLE IF NOT EXISTS blogs (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Fatima Laila',
    category VARCHAR(100) DEFAULT 'Style Guide',
    read_time VARCHAR(20) DEFAULT '5 min read',
    is_featured TINYINT(1) DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 13. Blog Comments Table
  `CREATE TABLE IF NOT EXISTS blog_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(150) NOT NULL,
    comment_text TEXT NOT NULL,
    status ENUM('Approved', 'Pending') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 14. Contact Messages Table
  `CREATE TABLE IF NOT EXISTS contact_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 15. Sliders / Banners Table
  `CREATE TABLE IF NOT EXISTS sliders (
    slider_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    image_url VARCHAR(500),
    button_link VARCHAR(255),
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 16. Newsletter Subscribers Table
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    subscriber_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    source VARCHAR(100) DEFAULT 'Footer',
    status ENUM('Active', 'Unsubscribed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 17. Site Sections CMS Table — every page/component's text, titles, images
  `CREATE TABLE IF NOT EXISTS site_sections (
    section_key VARCHAR(100) PRIMARY KEY,
    page_name VARCHAR(50) NOT NULL,
    section_name VARCHAR(150) NOT NULL,
    title VARCHAR(500),
    subtitle VARCHAR(1000),
    body_content TEXT,
    image_url VARCHAR(500),
    image_url_2 VARCHAR(500),
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    badge_text VARCHAR(100),
    metadata JSON COMMENT 'Extra nested data: FAQ list, stat counters, social links, nav items',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 18. Admin Users Table — admin panel staff accounts
  `CREATE TABLE IF NOT EXISTS admin_users (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'editor', 'viewer') DEFAULT 'editor',
    designation VARCHAR(150),
    phone VARCHAR(30),
    location VARCHAR(150),
    avatar_url VARCHAR(500),
    permissions VARCHAR(255) DEFAULT '',
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 19. Testimonials Table — customer testimonials shown on home page
  `CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_location VARCHAR(100),
    avatar_url VARCHAR(500),
    rating TINYINT DEFAULT 5,
    review_text TEXT NOT NULL,
    product_bought VARCHAR(150),
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 20. Value Strip Items Table — value proposition strip items on home
  `CREATE TABLE IF NOT EXISTS value_strip_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    icon_svg TEXT,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    display_order INT DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 21. FAQs Table — global FAQs filterable by page context
  `CREATE TABLE IF NOT EXISTS faqs (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    page_context VARCHAR(100) DEFAULT 'home',
    display_order INT DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 22. Size Guide Rows Table — size guide table rows
  `CREATE TABLE IF NOT EXISTS size_guide_rows (
    row_id INT AUTO_INCREMENT PRIMARY KEY,
    size_label VARCHAR(20) NOT NULL,
    bust_cm VARCHAR(20),
    waist_cm VARCHAR(20),
    hip_cm VARCHAR(20),
    length_cm VARCHAR(20),
    us_size VARCHAR(20),
    uk_size VARCHAR(20),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 23. Navbar Links Table — navigation menu items
  `CREATE TABLE IF NOT EXISTS navbar_links (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    display_order INT DEFAULT 0,
    is_highlighted TINYINT(1) DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 24. Footer Links Table — footer quick link groups
  `CREATE TABLE IF NOT EXISTS footer_links (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
];

const seedData = [
  // 1. Seed Categories
  `INSERT IGNORE INTO categories (category_id, name, slug, description, image_url) VALUES 
    (1, 'CO-ORD SETS', 'co-ord-sets', 'Two-piece kaftans and matching co-ord sets crafted for effortless elegance.', '/hero2.png'),
    (2, 'ABAYAS', 'abayas', 'Luxury occasion, daywear, and open abayas with intricate draping and craftsmanship.', '/hero2.png'),
    (3, 'HIJABS & SCARVES', 'hijabs-scarves', 'Breathable Modal jersey, premium chiffon, and silk hijabs for everyday modesty.', '/hero1.png'),
    (4, 'EID COLLECTION', 'eid-collection', 'Exclusive festive couture featuring metallic trims, embroidery, and satin finishes.', '/hero2.png');`,

  // 2. Seed Products
  `INSERT IGNORE INTO products 
    (product_id, category_id, name, slug, description, price, compare_at_price, stock_quantity, image_url, thumbnails, badge, fit_type, color, color_swatches, sizes, fabric_type, status, is_featured) 
  VALUES 
    (
      101, 1, 'LAMIA OPEN KAFTAN SET', 'lamia-open-kaftan-set', 
      'Two-piece kaftan set with an inner layer and flowing open kaftan.',
      9900.00, 11500.00, 20, '/hero2.png',
      '["/hero2.png", "/hero1.png"]',
      'NEW IN', 'Regular Fit', 'Burgundy',
      '[{"name": "Burgundy", "hex": "#722F37"}, {"name": "Olive", "hex": "#5C6B44"}]',
      '["S", "M", "L", "XL"]', 'Premium Nida-Silk', 'Live', 1
    );`,

  // 3. Seed Offers
  `INSERT IGNORE INTO offers (offer_id, title, subtitle, promo_code, discount_percentage, min_order_amount, status) VALUES
    (1, 'Ramadan Special 20%', 'Get 20% off on all luxury kaftans and abaya sets', 'EID2026', 20, 5000.00, 'Active'),
    (2, 'Welcome Gift Rs. 500', 'Enjoy Rs. 500 discount on your first order over Rs. 3,000', 'LAILA500', 0, 3000.00, 'Active');`,

  // 4. Seed Store Locations
  `INSERT IGNORE INTO store_locations (location_id, store_name, city, address, phone, opening_hours, status) VALUES
    (1, 'Laila Hijabs Flagship Studio', 'Lahore', 'MM Alam Road, Gulberg III, Lahore, Pakistan', '+92 42 35789000', '11:00 AM - 9:00 PM', 'Active'),
    (2, 'Laila Hijabs Boutique Concession', 'Karachi', 'Dolmen Mall Clifton, 2nd Floor, Karachi', '+92 21 35291234', '12:00 PM - 10:00 PM', 'Active');`,

  // 5. Seed Blogs
  `INSERT IGNORE INTO blogs (blog_id, title, slug, excerpt, content, author, category, read_time, is_featured, status) VALUES
    (1, '5 Tips for Styling Chiffon Hijabs in Summer', '5-tips-styling-chiffon-hijabs', 'Chiffon hijabs offer lightweight comfort and beautiful drape...', 'Chiffon hijabs offer lightweight comfort and beautiful drape. Here are our top styling tips for summer modesty...', 'Fatima Laila', 'Styling Guide', '5 min read', 1, 'Live'),
    (2, 'The Art of Nida Silk Maintenance', 'art-of-nida-silk-maintenance', 'Caring for your luxury nida abayas ensures long-lasting fabric sheen...', 'Caring for your luxury nida abayas ensures long-lasting fabric sheen and softness...', 'Zainab Ahmed', 'Care Advice', '4 min read', 0, 'Live');`,

  // 6. Seed Users
  `INSERT IGNORE INTO users (user_id, full_name, email, password_hash, role, status) VALUES
    (1, 'Main Admin', 'admin@lailahijabs.com', '$2a$10$abcdefghijklmnopqrstuv', 'admin', 'Live'),
    (2, 'Ayesha Khan', 'ayesha@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'customer', 'Live');`,

  // 7. Seed Admin Users
  `INSERT IGNORE INTO admin_users (admin_id, full_name, email, password_hash, role, avatar_url, status) VALUES
    (1, 'Main Admin', 'admin@lailahijabs.com', '$2a$10$placeholder', 'super_admin', NULL, 'Active');`,

  // 8. Seed Testimonials
  `INSERT IGNORE INTO testimonials
    (testimonial_id, customer_name, customer_location, avatar_url, rating, review_text, product_bought, status, display_order)
  VALUES
    (1, 'Ayesha Malik', 'Lahore, Pakistan', NULL, 5,
     'Absolutely love the quality of my abaya! The fabric is so soft and the stitching is flawless. Highly recommend Laila Hijabs to every modest fashion lover.',
     'LAMIA OPEN KAFTAN SET', 'Live', 1),
    (2, 'Sana Raza', 'Karachi, Pakistan', NULL, 5,
     'I ordered the Eid collection and it arrived beautifully packaged. The colour is even more stunning in person. Will definitely order again!',
     'EID Collection Abaya', 'Live', 2),
    (3, 'Mariam Ali', 'Dubai, UAE', NULL, 5,
     'Laila Hijabs ships internationally and the quality speaks for itself. My chiffon hijab is divine — lightweight, silky, and perfect for any occasion.',
     'Premium Chiffon Hijab', 'Live', 3);`,

  // 9. Seed Value Strip Items
  `INSERT IGNORE INTO value_strip_items (item_id, icon_svg, title, subtitle, display_order, status) VALUES
    (1, 'truck',   'Free Delivery',   'On orders over Rs. 5,000', 1, 'Live'),
    (2, 'shield',  '100% Authentic',  'Genuine luxury fabrics',   2, 'Live'),
    (3, 'refresh', 'Easy Returns',    '7-day hassle-free returns', 3, 'Live'),
    (4, 'lock',    'Secure Payment',  '100% safe checkout',       4, 'Live');`,

  // 10. Seed FAQs (mix of home and product contexts)
  `INSERT IGNORE INTO faqs (faq_id, question, answer, page_context, display_order, status) VALUES
    (1, 'Do you offer custom sizing?',
     'Yes! Visit our Bespoke Custom Orders page to submit your exact measurements and our master tailors will craft your perfect fit.',
     'home', 1, 'Live'),
    (2, 'How long does delivery take?',
     'Standard delivery across Pakistan takes 3-5 business days. Express delivery is available at checkout.',
     'home', 2, 'Live'),
    (3, 'What fabrics do you use?',
     'We exclusively use premium nida, silk-nida blends, modal jersey, and luxury chiffon sourced from trusted mills.',
     'home', 3, 'Live'),
    (4, 'What sizes do you stock?',
     'We stock sizes from XXS to XXXL. Use our size guide on the product page to find your perfect fit. Custom sizing is also available.',
     'product', 1, 'Live'),
    (5, 'Can I return or exchange?',
     'We offer exchange within 7 days of delivery for unworn items in original packaging. Sale items are final sale.',
     'product', 2, 'Live');`,

  // 11. Seed Size Guide Rows (XS through XXL)
  `INSERT IGNORE INTO size_guide_rows (row_id, size_label, bust_cm, waist_cm, hip_cm, length_cm, us_size, uk_size, display_order) VALUES
    (1, 'XS',  '80-84',  '62-66', '86-90',   '138', 'XS / 0-2',   'UK 6-8',   1),
    (2, 'S',   '84-88',  '66-70', '90-94',   '140', 'S / 4-6',    'UK 8-10',  2),
    (3, 'M',   '88-92',  '70-74', '94-98',   '142', 'M / 8-10',   'UK 12-14', 3),
    (4, 'L',   '92-96',  '74-78', '98-102',  '144', 'L / 12-14',  'UK 16-18', 4),
    (5, 'XL',  '96-100', '78-82', '102-106', '146', 'XL / 16-18', 'UK 20-22', 5),
    (6, 'XXL', '100-105','82-87', '106-111', '148', 'XXL / 20-22','UK 24-26', 6);`,

  // 12. Seed Navbar Links
  `INSERT IGNORE INTO navbar_links (link_id, label, url, parent_id, display_order, is_highlighted, status) VALUES
    (1, 'Home',    '/',            NULL, 1, 0, 'Live'),
    (2, 'Shop',    '/collections', NULL, 2, 0, 'Live'),
    (3, 'About',   '/about',       NULL, 3, 0, 'Live'),
    (4, 'Blog',    '/blogs',       NULL, 4, 0, 'Live'),
    (5, 'Contact', '/contact',     NULL, 5, 0, 'Live');`,

  // 13. Seed Footer Links (3 groups: Quick Links, Help, Legal)
  `INSERT IGNORE INTO footer_links (link_id, group_name, label, url, display_order, status) VALUES
    (1,  'Quick Links', 'Home',           '/',               1, 'Live'),
    (2,  'Quick Links', 'Shop',           '/collections',    2, 'Live'),
    (3,  'Quick Links', 'About Us',       '/about',          3, 'Live'),
    (4,  'Quick Links', 'Blog',           '/blogs',          4, 'Live'),
    (5,  'Help',        'Contact Us',     '/contact',        1, 'Live'),
    (6,  'Help',        'Track My Order', '/account/orders', 2, 'Live'),
    (7,  'Help',        'Size Guide',     '/size-guide',     3, 'Live'),
    (8,  'Help',        'Custom Orders',  '/custom-orders',  4, 'Live'),
    (9,  'Legal',       'Privacy Policy', '/privacy',        1, 'Live'),
    (10, 'Legal',       'Terms of Use',   '/terms',          2, 'Live'),
    (11, 'Legal',       'Return Policy',  '/returns',        3, 'Live');`,

  // 14. Seed Site Sections (ALL page sections with full data)
  `INSERT IGNORE INTO site_sections 
    (section_key, page_name, section_name, title, subtitle, body_content, image_url, image_url_2, button_text, button_link, badge_text, metadata)
  VALUES
    (
      'global_navbar', 'Global', 'Navigation Bar',
      'Laila Hijabs', 'Modest Fashion For The Modern Woman',
      NULL, '/hero1.png', NULL,
      'Shop Now', '/collections', 'NEW ARRIVALS',
      '{"announcement_bar": "Free delivery on orders above Rs. 5,000 | Use code LAILA500", "nav_links": [{"label": "Home", "url": "/"}, {"label": "Shop", "url": "/collections"}, {"label": "About", "url": "/about"}, {"label": "Blog", "url": "/blogs"}, {"label": "Contact", "url": "/contact"}], "logo_text": "LAILA HIJABS"}'
    ),
    (
      'global_footer', 'Global', 'Footer',
      'Laila Hijabs', 'Where modesty meets luxury.',
      'We craft premium modest fashion with heart and heritage. Every piece celebrates the beauty of modest dressing through exquisite fabrics and thoughtful design.',
      '/logo.png', NULL,
      'Shop Collections', '/collections', NULL,
      '{"quick_links": [{"label": "About Us", "url": "/about"}, {"label": "Shop", "url": "/collections"}, {"label": "Blog", "url": "/blogs"}, {"label": "Contact", "url": "/contact"}, {"label": "Custom Orders", "url": "/custom-orders"}, {"label": "Affiliate Program", "url": "/affiliate"}], "social_links": [{"platform": "Instagram", "url": "https://instagram.com/lailahijabs"}, {"platform": "TikTok", "url": "https://tiktok.com/@lailahijabs"}, {"platform": "Facebook", "url": "https://facebook.com/lailahijabs"}], "contact_info": {"phone": "+92 300 1234567", "email": "hello@lailahijabs.com", "address": "Lahore, Pakistan"}, "copyright": "© 2026 Laila Hijabs. All rights reserved."}'
    ),
    (
      'home_hero', 'Home', 'Hero Banner',
      'Luxury Modest Fashion', 'Discover Our New Collection',
      'Timeless elegance crafted for the modern modest woman. Premium fabrics, exquisite cuts, divine confidence.',
      '/hero1.png', '/hero2.png',
      'Shop The Collection', '/collections', 'NEW ARRIVALS',
      '{"hero_slides": [{"title": "KAFTAN COUTURE", "subtitle": "Eid 2026 Collection", "image": "/hero1.png", "button": "Shop Now"}, {"title": "PREMIUM ABAYAS", "subtitle": "Daily Luxury", "image": "/hero2.png", "button": "Explore"}]}'
    ),
    (
      'home_about', 'Home', 'Home About Section',
      'Crafted With Heritage & Heart', 'Our Story of Modest Elegance',
      'Laila Hijabs was born from a love of beautiful, purposeful fashion. We believe modesty should never compromise style — so we create luxury pieces that celebrate both. From hand-selected fabrics to careful stitching, every detail is an act of devotion.',
      '/hero2.png', NULL,
      'Discover Our Story', '/about', 'OUR STORY',
      NULL
    ),
    (
      'home_choose_us', 'Home', 'Why Choose Us',
      'Why Thousands Choose Laila Hijabs', 'Our Promise To You',
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"pillars": [{"icon": "✦", "title": "Premium Fabrics", "desc": "Hand-curated nida, chiffon, and jersey sourced from trusted mills"}, {"icon": "✦", "title": "Expert Tailoring", "desc": "Every abaya stitched to precise fit specifications"}, {"icon": "✦", "title": "Modest First", "desc": "All designs reviewed for comfort and modesty coverage"}, {"icon": "✦", "title": "Worldwide Delivery", "desc": "Shipped across Pakistan and internationally"}]}'
    ),
    (
      'home_faq', 'Home', 'Home Page FAQ',
      'Frequently Asked Questions', 'Have Questions? We Have Answers.',
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"faqs": [{"q": "Do you offer custom sizing?", "a": "Yes! Visit our Bespoke Custom Orders page to submit your exact measurements."}, {"q": "How long does delivery take?", "a": "Standard delivery across Pakistan takes 3-5 business days."}, {"q": "What fabrics do you use?", "a": "We exclusively use premium nida, silk-nida blends, modal jersey, and luxury chiffon."}, {"q": "Can I return or exchange?", "a": "We offer exchange within 7 days of delivery for unworn items in original packaging."}]}'
    ),
    (
      'home_services_header', 'Home', 'Collections Section Header',
      'Shop By Category', 'Find Your Perfect Match',
      'From everyday abayas to festive kaftans — discover a curated world of modest luxury.',
      '/hero1.png', NULL, NULL, NULL, 'COLLECTIONS', NULL
    ),
    (
      'home_featured_collections', 'Home', 'Featured Collections Banner',
      'The Eid Edit 2026', 'Exclusively Crafted For Celebrations',
      'A capsule of festive kaftans, embellished abayas, and co-ord sets designed for your most special moments.',
      '/hero2.png', '/hero1.png',
      'Shop Eid Collection', '/collections/eid-collection', 'EXCLUSIVE', NULL
    ),
    (
      'home_cta', 'Home', 'Home In-Touch CTA Banner',
      'Let''s Create Something Beautiful Together', 'Book Your Bespoke Consultation',
      'Have a vision in mind? Our design team is here to bring your dream modest garment to life with precision craftsmanship.',
      '/hero2.png', NULL,
      'Start Your Custom Order', '/custom-orders', 'BESPOKE TAILORING', NULL
    ),
    (
      'about_stats', 'About', 'About Page Stats',
      'Numbers That Tell Our Story', NULL,
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"stats": [{"value": "10,000+", "label": "Happy Customers"}, {"value": "500+", "label": "Unique Designs"}, {"value": "4.9★", "label": "Average Rating"}, {"value": "8+", "label": "Years of Craft"}]}'
    ),
    (
      'about_who_we_are', 'About', 'Who We Are',
      'Who We Are', 'A Legacy of Modest Luxury',
      'Laila Hijabs is Pakistan''s leading luxury modest fashion house. Founded in Lahore, we blend traditional craftsmanship with contemporary design to create pieces that celebrate both faith and fashion. Our team of expert designers and seamstresses pour their passion into every garment we produce.',
      '/hero1.png', '/hero2.png',
      'Meet Our Team', '/about', NULL, NULL
    ),
    (
      'about_mission', 'About', 'Brand Mission',
      'Our Mission', 'Empowering Women Through Elegant Modesty',
      'To redefine modest fashion as a celebration of identity, culture, and femininity — creating garments that allow women to feel confident, beautiful, and true to themselves.',
      NULL, NULL, NULL, NULL, NULL, NULL
    ),
    (
      'contact_main_section', 'Contact', 'Contact Page Header',
      'Get In Touch', 'We''d Love To Hear From You',
      'Whether you have a question about an order, need styling advice, or want to explore our bespoke service — our team is here and happy to help.',
      '/hero2.png', NULL, NULL, NULL, NULL, NULL
    ),
    (
      'contact_channels', 'Contact', 'Support Channels',
      'How To Reach Us', NULL, NULL, NULL, NULL, NULL, NULL, NULL,
      '{"channels": [{"icon": "📧", "label": "Email Us", "value": "hello@lailahijabs.com", "link": "mailto:hello@lailahijabs.com"}, {"icon": "📞", "label": "Call Us", "value": "+92 300 1234567", "link": "tel:+923001234567"}, {"icon": "💬", "label": "WhatsApp", "value": "Chat With Us", "link": "https://wa.me/923001234567"}, {"icon": "📍", "label": "Visit Us", "value": "Gulberg III, Lahore, Pakistan", "link": "https://maps.google.com"}]}'
    ),
    (
      'contact_hours', 'Contact', 'Support Hours',
      'We''re Available', 'Operating Hours',
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"hours": [{"day": "Monday – Friday", "time": "10:00 AM – 7:00 PM"}, {"day": "Saturday", "time": "11:00 AM – 6:00 PM"}, {"day": "Sunday", "time": "Closed"}]}'
    ),
    (
      'contact_faq', 'Contact', 'Contact Page FAQ',
      'Common Questions', NULL, NULL, NULL, NULL, NULL, NULL, NULL,
      '{"faqs": [{"q": "How can I track my order?", "a": "You will receive a tracking SMS and email once your order is dispatched."}, {"q": "Can I change my delivery address?", "a": "Please contact us within 24 hours of placing the order to update your address."}, {"q": "Do you ship internationally?", "a": "Yes! We ship to UAE, UK, USA, Canada, and other countries. International shipping charges apply."}]}'
    ),
    (
      'custom_orders_settings', 'Bespoke', 'Custom Orders Page Settings',
      'Bespoke Tailoring For You', 'Your Measurements, Your Vision, Our Craft',
      'Fill in your exact measurements and fabric preferences and our master tailors will create your dream abaya or kaftan from scratch — perfectly fitted just for you.',
      '/hero2.png', NULL,
      'Place Your Bespoke Order', '/custom-orders', 'BESPOKE',
      '{"garment_types": ["Abaya", "Kaftan", "Co-Ord Set", "Jilbab", "Maxi Dress", "Other"], "fabric_options": ["Premium Nida", "Silk-Nida Blend", "Chiffon", "Modal Jersey", "Luxury Satin", "Linen"], "steps": [{"step": 1, "title": "Choose Garment", "desc": "Select your garment type and fabric"}, {"step": 2, "title": "Enter Measurements", "desc": "Provide your exact size details"}, {"step": 3, "title": "Design Details", "desc": "Describe your color and style preferences"}, {"step": 4, "title": "Submit & Confirm", "desc": "Our team will contact you to confirm"}]}'
    ),
    (
      'affiliate_program_settings', 'Ambassador', 'Affiliate Program Settings',
      'Join The Laila Hijabs Family', 'Earn With Every Sale',
      'Love our modest fashion? Share it with your community and earn a generous commission on every sale you refer. Join our growing family of style ambassadors.',
      '/hero1.png', NULL,
      'Apply Now', '/affiliate', 'EARN 15% COMMISSION',
      '{"commission_rate": "15%", "perks": ["15% commission on every sale", "Exclusive ambassador discount code", "Early access to new collections", "Free PR packages for top performers", "Monthly payouts via bank transfer"], "tiers": [{"name": "Silver Ambassador", "requirement": "5+ referrals/month", "reward": "15% commission"}, {"name": "Gold Ambassador", "requirement": "20+ referrals/month", "reward": "20% commission + PR package"}, {"name": "Platinum Ambassador", "requirement": "50+ referrals/month", "reward": "25% commission + exclusive collections"}]}'
    ),
    (
      'home_announcement_bar', 'Home', 'Announcement Bar',
      'Free delivery on orders above Rs. 5,000', NULL,
      NULL, NULL, NULL, NULL, '/offers', 'LIMITED TIME',
      '{"is_enabled": true, "background_color": "#3E4930", "text_color": "#F6F1E3"}'
    ),
    (
      'home_value_strip', 'Home', 'Value Strip',
      'Our Promise', NULL,
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"items": [{"icon": "truck", "title": "Free Delivery", "subtitle": "On orders over Rs. 5,000"}, {"icon": "shield", "title": "100% Authentic", "subtitle": "Genuine luxury fabrics"}, {"icon": "refresh", "title": "Easy Returns", "subtitle": "7-day hassle-free returns"}, {"icon": "lock", "title": "Secure Payment", "subtitle": "100% safe checkout"}]}'
    ),
    (
      'home_trending', 'Home', 'Trending Section',
      'Trending Now', 'Our Most-Loved Pieces This Season',
      NULL, NULL, NULL, NULL, NULL, 'HOT RIGHT NOW', NULL
    ),
    (
      'home_testimonials_section', 'Home', 'Testimonials Section',
      'What Our Customers Say', 'Loved By Thousands Across Pakistan & Beyond',
      NULL, '/hero2.png', NULL, NULL, NULL, NULL, NULL
    ),
    (
      'home_review_banner', 'Home', 'Review Banner',
      '4.9 Stars Across 2,000+ Reviews', 'Join thousands of satisfied modest fashion lovers',
      NULL, NULL, NULL, NULL, NULL, 'TRUSTED', NULL
    ),
    (
      'home_whatsapp_float', 'Home', 'WhatsApp Float Button',
      'Chat With Us', NULL,
      NULL, NULL, NULL, NULL, 'https://wa.me/923001234567', NULL,
      '{"is_enabled": true, "phone": "+923001234567", "message": "Hello! I am interested in your collection.", "position": "bottom-right"}'
    ),
    (
      'home_value_slider', 'Home', 'Value Slider Section',
      'Why Laila Hijabs?', 'Crafted For The Conscious Woman',
      NULL, '/hero1.png', NULL, NULL, NULL, NULL, NULL
    ),
    (
      'products_page_header', 'Products', 'Products Page Header',
      'Our Collections', 'Discover Your Perfect Modest Look',
      NULL, '/hero2.png', NULL, NULL, NULL, NULL, NULL
    ),
    (
      'products_size_guide', 'Products', 'Size Guide',
      'Find Your Perfect Fit', 'Use our size guide to choose the right fit',
      'All measurements are in centimetres (cm). If you are between sizes, we recommend sizing up for comfort.',
      NULL, NULL, NULL, NULL, NULL, NULL
    ),
    (
      'products_filters_config', 'Products', 'Filter Settings',
      'Filter Options', NULL,
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"colors": ["Black","Ivory","Burgundy","Olive","Navy","Dusty Pink","Stone","Charcoal"], "sizes": ["XXS","XS","S","M","L","XL","XXL","XXXL"], "fabrics": ["Nida","Chiffon","Jersey","Silk-Nida","Satin","Linen"], "sort_options": ["Newest","Price: Low to High","Price: High to Low","Most Popular","Best Rated"]}'
    ),
    (
      'products_specs_template', 'Products', 'Specifications Template',
      'Category Specifications & Customization', NULL,
      'All garments are handcrafted in Pakistan using ethically sourced luxury fabrics. Custom sizing available on request.',
      NULL, NULL, NULL, NULL, NULL,
      '{"spec_labels": ["Fabric","Fit","Care Instructions","Country of Origin","Lining"], "care_instructions": "Dry clean only. Do not bleach. Store in a cool, dry place.", "customization_note": "Custom colours and sizes available. Contact us to enquire."}'
    ),
    (
      'offers_page_header', 'Offers', 'Offers Page Header',
      'Exclusive Offers & Discounts', 'Hand-Picked Deals On Luxury Modest Fashion',
      NULL, '/hero2.png', NULL, NULL, NULL, 'SAVE BIG', NULL
    ),
    (
      'blogs_page_header', 'Blogs', 'Blogs Page Header',
      'Style Notes & Modesty Stories', 'Your go-to source for modest fashion inspiration, care tips, and styling guides.',
      NULL, '/hero1.png', NULL, NULL, NULL, 'THE EDIT', NULL
    ),
    (
      'blogs_filters_config', 'Blogs', 'Blog Filter Categories',
      NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
      '{"categories": ["All","Styling Guide","Care Advice","Modest Living","New Arrivals","Eid Edit","Behind The Scenes"]}'
    ),
    (
      'account_page_settings', 'Account', 'Account Page Settings',
      'My Account', 'Manage your orders, wishlist, and personal details',
      'Welcome back! Track your orders, update your profile, and manage your saved items all in one place.',
      NULL, NULL, NULL, NULL, NULL, NULL
    ),
    (
      'cart_page_settings', 'Cart', 'Cart Page Settings',
      'Your Shopping Bag', 'Review your selected items before checkout',
      'Free delivery on orders above Rs. 5,000',
      NULL, NULL, NULL, NULL, NULL,
      '{"free_delivery_threshold": 5000, "currency": "PKR", "empty_cart_message": "Your bag is empty. Discover our latest collection.", "empty_cart_button": "Shop Now", "empty_cart_link": "/collections"}'
    ),
    (
      'wishlist_page_settings', 'Wishlist', 'Wishlist Page Settings',
      'Your Wishlist', 'Saved items you love',
      NULL, NULL, NULL, NULL, NULL, NULL,
      '{"empty_wishlist_message": "Your wishlist is empty. Start saving your favourite pieces!", "empty_wishlist_button": "Explore Collections", "empty_wishlist_link": "/collections"}'
    ),
    (
      'navbar_settings', 'Global', 'Navbar Settings',
      'Laila Hijabs', NULL,
      NULL, NULL, NULL, NULL, NULL, 'NEW ARRIVALS',
      '{"show_search": true, "show_wishlist": true, "show_cart": true, "show_account": true, "logo_text": "LAILA HIJABS", "sticky": true}'
    ),
    (
      'footer_settings', 'Global', 'Footer Settings',
      'Laila Hijabs', 'Where modesty meets luxury',
      'Crafting premium modest fashion since 2018',
      '/logo.png', NULL, NULL, NULL, NULL,
      '{"show_newsletter": true, "newsletter_placeholder": "Enter your email address", "newsletter_button": "Subscribe", "copyright": "2026 Laila Hijabs. All rights reserved.", "social": {"instagram": "https://instagram.com/lailahijabs", "tiktok": "https://tiktok.com/@lailahijabs", "facebook": "https://facebook.com/lailahijabs", "youtube": ""}}'
    ),
    (
      'footer_about_text', 'Global', 'Footer About Text',
      'About Laila Hijabs', NULL,
      'We are Pakistan''s premier modest fashion house, creating luxury abayas, kaftans, and hijabs for the modern Muslim woman.',
      NULL, NULL, NULL, NULL, NULL, NULL
    ),
    (
      'scroll_to_top_settings', 'Global', 'Scroll To Top Settings',
      NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
      '{"is_enabled": true, "threshold_px": 400, "position": "bottom-right"}'
    ),
    (
      'location_page_header', 'Locations', 'Locations Page Header',
      'Visit Our Studios', 'Find a Laila Hijabs Studio Near You',
      'Experience our premium modest wear collection in person. Our team is on hand for personal styling, fabric consultations, and bespoke fittings.',
      '/hero2.png', NULL,
      'Book an Appointment', '/contact', 'VISIT US',
      NULL
    ),
    (
      'location_visit_us_section', 'Locations', 'Visit Us — Fabric In Person Section',
      'Prefer to see the fabric in person?', 'Our studio welcomes visits by appointment.',
      'If you''re not close by, our team is just as happy to guide you over WhatsApp or a call.',
      '/hero1.png', '/hero2.png',
      'View Location Details', '/locations', 'VISIT US',
      NULL
    ),
    (
      'location_detail_page', 'Locations', 'Location Detail Page — Static Labels',
      'Studio Details', NULL, NULL,
      NULL, NULL,
      NULL, NULL, NULL,
      '{"section_contact_label": "Location & Contact Details", "map_section_label": "Find Us on Google Maps", "full_address_label": "Full Address", "opening_hours_label": "Opening Hours", "phone_label": "Phone & Support", "email_label": "Email Address", "get_directions_btn": "Get Directions"}'
    )
  ;`
];

module.exports = { createTables, seedData };