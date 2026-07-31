import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllCategoriesPage.css';

const AllCategoriesPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(cat => ({
          title: cat.name,
          count: "Explore Collection",
          desc: cat.description,
          image: cat.image_url,
          path: `/categories/${cat.slug}`
        }));
        setCollections(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch categories", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 20px' }}>Loading categories...</div>;
  }

  return (
    <div className="all-cats-wrapper">
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Categories
        </div>

        {/* Page Title */}
        <div className="cats-header">
          <span className="eyebrow">Explore Our Wardrobe</span>
          <h1>All Collections</h1>
          <p>Each piece is designed with an uncompromising dedication to modesty, premium fabric quality, and timeless craftsmanship.</p>
        </div>

        {/* Category Cards Grid */}
        <div className="cats-grid">
          {collections.map((cat, index) => (
            <Link to={cat.path} className="cat-hub-card" key={index}>
              <img src={cat.image} alt={cat.title} />
              <div className="cat-hub-content">
                <span className="item-count">{cat.count}</span>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <div className="explore-link">
                  Explore Collection
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesPage;