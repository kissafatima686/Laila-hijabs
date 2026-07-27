import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogs';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { blogId } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(blogId, 10));

  if (!post) {
    return (
      <div className="blog-detail-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Post Not Found</h2>
        <p>Sorry, we couldn't find the blog post you were looking for.</p>
        <Link to="/blogs" style={{ color: '#3E4930', textDecoration: 'underline' }}>Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-container" style={{ background: '#F6F1E3', minHeight: '100vh', padding: '60px 20px' }}>
      <div className="blog-detail-wrapper" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
        <div className="crumb" style={{ fontSize: '13px', color: '#6b6a58', marginBottom: '30px' }}>
          <Link to="/" style={{ color: '#6b6a58', textDecoration: 'none' }}>Home</Link><span> / </span>
          <Link to="/blogs" style={{ color: '#6b6a58', textDecoration: 'none' }}>Blogs</Link><span> / </span>
          {post.title}
        </div>

        <span className="eyebrow" style={{ color: '#B8935B', display: 'block', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>{post.category}</span>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: '#3E4930', marginBottom: '15px', lineHeight: '1.2' }}>{post.title}</h1>
        <div className="blog-meta" style={{ fontSize: '13px', color: '#888', marginBottom: '30px' }}>{post.date} · {post.readTime}</div>

        <img src={post.image} alt={post.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />

        <div className="blog-body-content" style={{ fontSize: '16px', lineHeight: '1.8', color: '#2A2A22', whiteSpace: 'pre-wrap', fontFamily: 'Jost, sans-serif' }}>
          <p>{post.content}</p>
          <br />
          <p>
            At Laila Hijabs, we believe that modest wear should never compromise on comfort or aesthetics. Every pattern we draft is focused on providing full coverage while maintaining fluid movements and a tailored finish. Stay tuned for more fabric care tips and styling inspirations from our designers.
          </p>
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid rgba(42,42,34,0.1)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/blogs" style={{ color: '#3E4930', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>← Back to All Posts</Link>
          <a href="https://wa.me/923238399480" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3E4930', color: '#fff', padding: '10px 20px', borderRadius: '2px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
            <IoLogoWhatsapp size={16} /> Chat with us
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
