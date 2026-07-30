import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { useContent } from '../context/useContent';
import './BlogsPage.css';

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState('');
  const { getSectionContent } = useContent();

  const title = getSectionContent('blogs_page_header', 'title', 'Notes on grace, fabric, and everyday style');
  const subtitle = getSectionContent('blogs_page_header', 'subtitle', '');
  const body = getSectionContent('blogs_page_header', 'body_content', 'Styling ideas, fabric guides, and quiet reflections from our studio — written for the woman who wears her modesty with confidence.');
  const badgeText = getSectionContent('blogs_page_header', 'badge_text', 'The Laila Journal');
  
  const rawCategories = getSectionContent('blogs_filters_config', 'categories', '');
  const configCategories = (typeof rawCategories === 'string' && rawCategories.trim() !== '') 
    ? rawCategories.split(',').map(c => c.trim()) 
    : ["Styling Guides", "Fabric & Care", "Eid & Occasion", "Brand Journal", "How to Order"];

  const categories = ["All Posts", ...configCategories];

  // Blog post data mapped from original structure including featured post
  const blogPosts = [
    {
      id: 0,
      category: "Styling Guides",
      image: "/Categories/hijabs/hijab1.png",
      title: "Five Ways to Style One Hijab for Campus, Work, and Eid",
      desc: "One versatile piece can carry you through an entire week — here's how to wrap, layer, and pin a single Everyday hijab for five completely different occasions.",
      date: "July 2, 2026",
      readTime: "4 min read",
      isFeatured: true
    },
    {
      id: 1,
      category: "Fabric & Care",
      image: "/Categories/hijabs/hijab1.png",
      title: "Chiffon vs. Jersey vs. Silk: Which Fabric Fits Your Day?",
      desc: "A simple guide to choosing the right hijab fabric for humidity, formality, and how long you'll be wearing it.",
      date: "June 24, 2026",
      readTime: "3 min read"
    },
    {
      id: 2,
      category: "Eid & Occasion",
      image: "/Categories/abaya/abaya5.png",
      title: "The Laila Eid Edit: Building Your Occasion Wardrobe Early",
      desc: "Why the best Eid looks are planned weeks ahead — and how to pair an abaya with the right hijab and accessories.",
      date: "June 18, 2026",
      readTime: "5 min read"
    },
    {
      id: 3,
      category: "How to Order",
      image: "/Categories/iranichadar/irani1.png",
      title: "New Here? How Ordering on WhatsApp Actually Works",
      desc: "A step-by-step walkthrough for first-time visitors — from picking a piece online to receiving it at your door.",
      date: "June 10, 2026",
      readTime: "2 min read"
    },
    {
      id: 4,
      category: "Brand Journal",
      image: "/Categories/abaya/abaya1.png",
      title: "Why We Chose Olive and Gold for Laila",
      desc: "A short note on the colors, and the quiet confidence we wanted every piece to carry from day one.",
      date: "June 2, 2026",
      readTime: "3 min read"
    },
    {
      id: 5,
      category: "Fabric & Care",
      image: "/Categories/hijabs/hijab2.png",
      title: "How to Wash and Store Your Hijabs So They Last",
      desc: "Simple care habits that keep chiffon crisp, silk lustrous, and jersey soft — wash by wash.",
      date: "May 27, 2026",
      readTime: "4 min read"
    },
    {
      id: 6,
      category: "Brand Journal",
      image: "/Categories/jilbab/jilbab2.png",
      title: "A Behind-the-Scenes Look at Our Islamabad Studio",
      desc: "Where the designs are drafted, patterns are cut, and custom abayas are tailored to order.",
      date: "May 20, 2026",
      readTime: "3 min read"
    }
  ];

  // Filter posts based on global search query or category pill
  const filteredPosts = blogPosts.filter(post => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const fullText = `${post.title} ${post.desc} ${post.category} ${post.date}`.toLowerCase();
      return fullText.includes(q);
    }
    // When not searching, filter by active category pill
    if (activeCategory === "All Posts") return !post.isFeatured;
    return post.category === activeCategory;
  });

  const featuredPost = blogPosts.find(p => p.isFeatured);

  return (
    <div className="blogs-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Blogs
        </div>

        {/* Journal Hero */}
        <div className="journal-hero">
          <span className="eyebrow">{badgeText}</span>
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
          <p>{body}</p>
        </div>

        {/* Category Filter & Search Bar */}
        <div className="blog-toolbar">
          <div className="tag-row">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                className={`tag-pill ${activeCategory === cat && !searchQuery ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={`blog-search-box ${searchQuery ? 'has-query' : ''}`}>
            <IoSearchOutline className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search stories, fabrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <IoCloseOutline size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Feedback Bar */}
        {searchQuery.trim() && (
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(42,42,34,0.1)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#3E4930', fontWeight: '500' }}>
              Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
            <button 
              onClick={() => setSearchQuery('')} 
              style={{ background: 'none', border: 'none', color: '#B8935B', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Featured Post (Only show on 'All Posts' or 'Styling Guides' when not searching) */}
        {(activeCategory === "All Posts" || activeCategory === "Styling Guides") && !searchQuery.trim() && featuredPost && (
          <Link to={`/blogs/${featuredPost.id}`} className="featured-post" style={{ display: 'grid', textDecoration: 'none', color: 'inherit' }}>
            <div className="featured-img"><img src={featuredPost.image} alt={featuredPost.title} /></div>
            <div className="featured-copy">
              <span className="eyebrow">Featured · {featuredPost.category}</span>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.desc}</p>
              <div className="post-meta">{featuredPost.date} · {featuredPost.readTime}</div>
              <span className="read-link">Read the Full Story →</span>
            </div>
          </Link>
        )}

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link 
                to={`/blogs/${post.id}`} 
                className="blog-card" 
                key={post.id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="blog-img">
                  <span className="cat-chip">{post.category}</span>
                  <img src={post.image} alt={post.title} />
                </div>
                <h3>{post.title}</h3>
                <p>{post.desc}</p>
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 0', color: '#6b6a58' }}>
              <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '500', color: '#3E4930' }}>
                {searchQuery ? `No articles found matching "${searchQuery}"` : 'No articles found in this category.'}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>Try searching for words like "Chiffon", "Eid", "Abaya", "Care", or "Studio"!</p>
            </div>
          )}
        </div>

        {/* Pagination[cite: 6] */}
        <div className="pagination">
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">â†’</a>
        </div>

        {/* Newsletter[cite: 6] */}
        <div className="capture">
          <span className="eyebrow">Stay in the Loop</span>
          <h2>New stories, sent straight to you</h2>
          <p>Styling ideas and fabric guides once or twice a month â€” no spam, just soft launches and quiet reads.</p>
          <form className="capture-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Floating WhatsApp Action Button */}
    </div>
  );
};

export default BlogsPage;