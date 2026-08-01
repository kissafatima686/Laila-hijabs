// models/schema.js

const createTables = [
  // 1. Categories Table
  `CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    image_url VARCHAR(255),
    banner_image VARCHAR(255),
    hero_title VARCHAR(255),
    hero_description VARCHAR(500),
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    status ENUM('Live', 'Active', 'Draft') DEFAULT 'Live',
    display_order INT DEFAULT 0,
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
    sku VARCHAR(100) UNIQUE,
    short_description VARCHAR(500),
    long_description TEXT,
    care_instructions TEXT,
    fabric_details TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2) DEFAULT NULL,
    stock INT DEFAULT 0,
    status ENUM('Live', 'Draft') DEFAULT 'Live',
    is_featured TINYINT(1) DEFAULT 0,
    is_new_arrival TINYINT(1) DEFAULT 0,
    seo_title VARCHAR(255),
    meta_description VARCHAR(500),
    keywords VARCHAR(255),
    canonical_url VARCHAR(255),
    size_guide_id INT,
    bundle_attributes JSON,
    category_slug VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_category_slug (category_slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3a. Category Filters
  `CREATE TABLE IF NOT EXISTS category_filters (
    filter_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    filter_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3b. Product Images
  `CREATE TABLE IF NOT EXISTS product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_main TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3c. Colors Table
  `CREATE TABLE IF NOT EXISTS colors (
    color_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hex_code VARCHAR(20) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3d. Product Variants
  `CREATE TABLE IF NOT EXISTS product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color_id INT NOT NULL,
    sku VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors(color_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3e. Sizes Table
  `CREATE TABLE IF NOT EXISTS sizes (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    size_name VARCHAR(20) NOT NULL,
    display_order INT DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3f. Product Sizes
  `CREATE TABLE IF NOT EXISTS product_sizes (
    product_id INT NOT NULL,
    size_id INT NOT NULL,
    PRIMARY KEY (product_id, size_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(size_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3g. Specification Groups
  `CREATE TABLE IF NOT EXISTS specification_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3h. Specifications
  `CREATE TABLE IF NOT EXISTS specifications (
    spec_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    spec_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES specification_groups(group_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3i. Product Specifications
  `CREATE TABLE IF NOT EXISTS product_specifications (
    product_id INT NOT NULL,
    spec_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id, spec_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (spec_id) REFERENCES specifications(spec_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3j. Customizations
  `CREATE TABLE IF NOT EXISTS customizations (
    customization_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    options_json JSON
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3k. Product Customizations
  `CREATE TABLE IF NOT EXISTS product_customizations (
    product_id INT NOT NULL,
    customization_id INT NOT NULL,
    PRIMARY KEY (product_id, customization_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (customization_id) REFERENCES customizations(customization_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3l. Size Guides
  `CREATE TABLE IF NOT EXISTS size_guides (
    guide_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    guide_type VARCHAR(50)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3m. Product FAQs
  `CREATE TABLE IF NOT EXISTS product_faqs (
    product_id INT NOT NULL,
    faq_id INT NOT NULL,
    PRIMARY KEY (product_id, faq_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 3n. Related Products\n  CREATE TABLE IF NOT EXISTS product_sections (\n    section_id INT AUTO_INCREMENT PRIMARY KEY,\n    section_name VARCHAR(100) NOT NULL,\n    section_key VARCHAR(100) UNIQUE NOT NULL,\n    default_display_order INT DEFAULT 0,\n    status ENUM('Live', 'Active', 'Inactive') DEFAULT 'Live',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;,\n\n  CREATE TABLE IF NOT EXISTS product_section_mapping (\n    mapping_id INT AUTO_INCREMENT PRIMARY KEY,\n    product_id INT NOT NULL,\n    section_id INT NOT NULL,\n    is_visible ENUM(\'Y\', \'N\') DEFAULT \'Y\',\n    display_order INT DEFAULT 0,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,\n    FOREIGN KEY (section_id) REFERENCES product_sections(section_id) ON DELETE CASCADE,\n    UNIQUE KEY product_section_unique (product_id, section_id)\n  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;,\n\n  CREATE TABLE IF NOT EXISTS website_sections (\n    section_id INT AUTO_INCREMENT PRIMARY KEY,\n    section_key VARCHAR(100) UNIQUE NOT NULL,\n    section_name VARCHAR(100) NOT NULL,\n    display_order INT DEFAULT 0,\n    status ENUM('Live', 'Active', 'Inactive') DEFAULT 'Live',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;,\n\n  // 3o. Related Products
  `CREATE TABLE IF NOT EXISTS related_products (
    product_id INT NOT NULL,
    related_id INT NOT NULL,
    PRIMARY KEY (product_id, related_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (related_id) REFERENCES products(product_id) ON DELETE CASCADE
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
    status ENUM('Live', 'Active', 'Expired') DEFAULT 'Live',
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
    status ENUM('Live', 'Active', 'Inactive') DEFAULT 'Live',
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
    status ENUM('Live', 'Active', 'Unsubscribed') DEFAULT 'Live',
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
    status ENUM('Live', 'Active', 'Inactive') DEFAULT 'Live',
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
    badge_text VARCHAR(50) DEFAULT NULL,
    badge_color VARCHAR(20) DEFAULT NULL,
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 25. Commission Plans Table
  `CREATE TABLE IF NOT EXISTS commission_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 26. Affiliates Table
  `CREATE TABLE IF NOT EXISTS affiliates (
    affiliate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    affiliate_link VARCHAR(255),
    plan_id INT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Suspended') DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES commission_plans(plan_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 27. Affiliate Clicks Table
  `CREATE TABLE IF NOT EXISTS affiliate_clicks (
    click_id INT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id INT NOT NULL,
    ip_address VARCHAR(45),
    browser VARCHAR(255),
    device VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(affiliate_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 28. Commissions Table
  `CREATE TABLE IF NOT EXISTS commissions (
    commission_id INT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id INT NOT NULL,
    order_id INT NOT NULL,
    sale_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Paid') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(affiliate_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  // 29. Payouts Table
  `CREATE TABLE IF NOT EXISTS payouts (
    payout_id INT AUTO_INCREMENT PRIMARY KEY,
    affiliate_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Bank Transfer', 'EasyPaisa', 'JazzCash', 'PayPal') NOT NULL,
    status ENUM('Pending', 'Paid') DEFAULT 'Paid',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(affiliate_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
];

const seedData = [
  // 1. Seed Categories
  `INSERT IGNORE INTO categories (category_id, name, slug, description, image_url, hero_title, hero_description, status) VALUES 
    (1, 'Abayas', 'abayas', 'Structured yet soft silhouettes tailored generously for daily grace and formal Eid gatherings.', '/Categories/abaya/abaya1.png', 'Elegant Everyday Abayas', 'Designed with premium fabrics...', 'Active'),
    (2, 'Hijabs', 'hijabs', 'Premium fabrics crafted with hand-rolled edges for everyday and formal elegance.', '/Categories/hijabs/hijab1.png', 'Premium Hijabs', 'Hand-rolled edges for everyday elegance.', 'Active'),
    (3, 'Irani Chadar', 'irani-chadar', 'Traditional flowing chadar providing full coverage with an elegant drape.', '/Categories/iranichadar/irani1.png', 'Irani Chadar Collection', 'Traditional flowing chadar providing full coverage.', 'Active'),
    (4, 'Jilbab', 'jilbab', 'Classic overhead and two-piece jilbabs designed for comfort and modesty.', '/Categories/jilbab/jilbab.png', 'Modest Jilbabs', 'Classic overhead and two-piece jilbabs.', 'Active'),
    (5, 'Namaz Chadar', 'namaz-chadar', 'Breathable and comfortable prayer chadar for your daily devotions.', '/Categories/namazchadar/namazchaddar.png', 'Prayer Wear', 'Breathable prayer chadar for your daily devotions.', 'Active'),
    (6, 'Round Chadar', 'round-chadar', 'Classic round chadar ensuring perfect coverage with premium nida fabric.', '/Categories/roundchadar/round1.png', 'Round Chadar', 'Classic round chadar ensuring perfect coverage.', 'Active');`,

  // 1a. Seed Category Filters
  `INSERT IGNORE INTO category_filters (filter_id, category_id, filter_name) VALUES
    (1, 1, 'Fabric'), (2, 1, 'Color'), (3, 1, 'Size'), (4, 1, 'Price'), (5, 1, 'Occasion'),
    (6, 2, 'Fabric'), (7, 2, 'Color'), (8, 2, 'Length');`,

  // 2. Seed Products (New Modular Structure)
  `INSERT IGNORE INTO size_guides (guide_id, name, guide_type) VALUES 
    (1, 'Abaya Size Guide', 'Abaya'), (2, 'Hijab Size Guide', 'Hijab');`,

  `INSERT IGNORE INTO colors (color_id, name, hex_code) VALUES
    (1, 'Black', '#000000'), (2, 'Burgundy', '#722F37'), (3, 'Olive', '#5C6B44'), (4, 'Ivory', '#FFFFF0'), (5, 'Dusty Rose', '#DCAE96');`,

  `INSERT IGNORE INTO sizes (size_id, size_name, display_order) VALUES
    (1, 'XXS', 1), (2, 'XS', 2), (3, 'S', 3), (4, 'M', 4), (5, 'L', 5), (6, 'XL', 6), (7, 'XXL', 7), (8, 'One Size', 8);`,

  `INSERT IGNORE INTO specification_groups (group_id, name) VALUES
    (1, 'Abaya Specifications'), (2, 'Hijab Specifications');`,

  `INSERT IGNORE INTO specifications (spec_id, group_id, spec_name) VALUES
    (1, 1, 'Length'), (2, 1, 'Sleeve'), (3, 1, 'Neck Style'), (4, 1, 'Fabric'), (5, 1, 'Pocket'),
    (6, 2, 'Length'), (7, 2, 'Width'), (8, 2, 'Fabric');`,

  `INSERT IGNORE INTO customizations (customization_id, name, options_json) VALUES
    (1, 'Length Adjustment', '["YES"]'), (2, 'Extra Sleeve', '["YES"]'), (3, 'Custom Size', '["YES"]'), (4, 'Embroidery', '["YES"]');`,

  \`INSERT IGNORE INTO products
    (product_id, category_id, category_slug, name, slug, sku, short_description, price, sale_price, stock, status, is_featured, is_new_arrival, size_guide_id)
  VALUES 
    (101, 1, 'abayas', 'LAMIA OPEN KAFTAN SET', 'lamia-open-kaftan-set', 'KAFTAN-101', 'Two-piece kaftan set with an inner layer and flowing open kaftan.', 11500.00, 9900.00, 20, 'Live', 1, 1, 1),
    (102, 1, 'abayas', 'Premium Nida Abaya', 'premium-nida-abaya-1', 'ABAYA-102', 'Classic black Saudi abaya crafted from smooth, high-grade Korean Nida fabric.', 6990.00, 5990.00, 25, 'Live', 1, 0, 1),
    (111, 2, 'hijabs', 'Premium Chiffon Hijab', 'premium-chiffon-hijab-1', 'HIJAB-111', 'Breathable lightweight chiffon hijab in dusty rose with hand-rolled hems.', 2900.00, 2400.00, 50, 'Live', 1, 0, 2);\`,

  `INSERT IGNORE INTO product_images (product_id, image_url, is_main, display_order) VALUES
    (101, '/hero2.png', 1, 1), (101, '/hero1.png', 0, 2),
    (102, '/Categories/abaya/abaya1.png', 1, 1),
    (111, '/Categories/hijabs/hijab1.png', 1, 1);`,

  `INSERT IGNORE INTO product_variants (variant_id, product_id, color_id, image_url, stock_quantity, sku) VALUES
    (1, 101, 2, '/hero2.png', 10, 'KAFTAN-101-BUR'),
    (2, 101, 3, '/hero1.png', 10, 'KAFTAN-101-OLI'),
    (3, 102, 1, '/Categories/abaya/abaya1.png', 25, 'ABAYA-102-BLK'),
    (4, 111, 5, '/Categories/hijabs/hijab1.png', 50, 'HIJAB-111-ROS');`,

  `INSERT IGNORE INTO product_sizes (product_id, size_id) VALUES
    (101, 3), (101, 4), (101, 5), (101, 6),
    (102, 2), (102, 3), (102, 4), (102, 5), (102, 6),
    (111, 8);`,

  `INSERT IGNORE INTO product_specifications (product_id, spec_id, value) VALUES
    (101, 4, 'Premium Nida-Silk'), (101, 2, 'Stand collar'), (101, 5, 'Side pockets'),
    (102, 4, 'Korean Nida'), (102, 2, 'Fitted Sleeve'),
    (111, 8, 'Georgette Chiffon'), (111, 6, '180cm'), (111, 7, '70cm');`,

  `INSERT IGNORE INTO product_customizations (product_id, customization_id) VALUES
    (101, 1), (101, 3), (102, 1), (102, 3), (111, 4);`,

  `INSERT IGNORE INTO related_products (product_id, related_id) VALUES
    (101, 102);`,

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

  // 13. Seed Footer Links (Groups: Delivery & Returns, Customer Care, Get In Touch, About Us)
  `INSERT IGNORE INTO footer_links (link_id, group_name, label, url, display_order, status) VALUES
    (1,  'Delivery & Returns', 'Free shipping for orders over £120', '/shipping',      1, 'Live'),
    (2,  'Delivery & Returns', 'Shipping information',             '/shipping-info', 2, 'Live'),
    (3,  'Delivery & Returns', 'Delivery',                         '/delivery',      3, 'Live'),
    (4,  'Delivery & Returns', 'Returns & Exchanges',              '/returns',       4, 'Live'),
    (5,  'Customer Care',      'Gift Card',                        '/gift-cards',    1, 'Live'),
    (6,  'Customer Care',      'Size guide',                       '/size-guide',    2, 'Live'),
    (7,  'Customer Care',      'Care & Repair',                    '/care-repair',   3, 'Live'),
    (8,  'Customer Care',      'Frequently asked questions',        '/faqs',          4, 'Live'),
    (9,  'Customer Care',      'Contact us',                       '/contact',       5, 'Live'),
    (10, 'Customer Care',      'Privacy policy',                   '/privacy',       6, 'Live'),
    (11, 'Customer Care',      'Terms & conditions',               '/terms',         7, 'Live'),
    (12, 'Get In Touch',       'Message us on WhatsApp',           'https://wa.me/923238399480', 1, 'Live'),
    (13, 'Get In Touch',       '+92 323 8399480',                  'tel:+923238399480',          2, 'Live'),
    (14, 'Get In Touch',       'Email us:',                        'mailto:info@lailahijabs.com', 3, 'Live'),
    (15, 'Get In Touch',       'info@lailahijabs.com',             'mailto:info@lailahijabs.com', 4, 'Live'),
    (16, 'About Us',           'Our Story',                        '/about',         1, 'Live'),
    (17, 'About Us',           'Loyalty',                          '/loyalty',       2, 'Live'),
    (18, 'About Us',           'Visit Us',                         '/locations',     3, 'Live'),
    (19, 'About Us',           'Careers',                          '/careers',       4, 'Live'),
    (20, 'About Us',           'Journal',                          '/blogs',         5, 'Live'),
    (21, 'About Us',           'Affiliates',                       '/affiliates',    6, 'Live');`,

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
  ;`,

  // 15. Seed Commission Plans
  `INSERT IGNORE INTO commission_plans (plan_id, name, commission_rate, description) VALUES
    (1, 'Bronze', 5.00, 'New affiliates'),
    (2, 'Silver', 10.00, 'Standard affiliates'),
    (3, 'Gold', 15.00, 'High-performing affiliates'),
    (4, 'VIP', 20.00, 'Influencers or strategic partners');`
];

module.exports = { createTables, seedData };