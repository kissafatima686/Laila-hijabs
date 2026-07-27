// src/pages/AllCategoriesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AllCategoriesPage.css';

const AllCategoriesPage = () => {
  const collections = [
    {
      title: "Abayas",
      count: "5 Designs",
      desc: "Structured yet soft silhouettes tailored generously for daily grace and formal Eid gatherings.",
      image: "/Categories/abaya/abaya1.png",
      path: "/categories/abayas"
    },
    {
      title: "Hijabs",
      count: "2 Colors",
      desc: "Premium fabrics crafted with hand-rolled edges for everyday and formal elegance.",
      image: "/Categories/hijabs/hijab1.png",
      path: "/categories/hijabs"
    },
    {
      title: "Irani Chadar",
      count: "5 Designs",
      desc: "Traditional flowing chadar providing full coverage with an elegant drape.",
      image: "/Categories/iranichadar/irani1.png",
      path: "/categories/irani-chadar"
    },
    {
      title: "Jilbab",
      count: "4 Designs",
      desc: "Classic overhead and two-piece jilbabs designed for comfort and modesty.",
      image: "/Categories/jilbab/jilbab.png",
      path: "/categories/jilbab"
    },
    {
      title: "Namaz Chadar",
      count: "1 Design",
      desc: "Breathable and comfortable prayer chadar for your daily devotions.",
      image: "/Categories/namazchadar/namazchaddar.png",
      path: "/categories/namaz-chadar"
    },
    {
      title: "Round Chadar",
      count: "1 Design",
      desc: "Classic round chadar ensuring perfect coverage with premium nida fabric.",
      image: "/Categories/roundchadar/round1.png",
      path: "/categories/round-chadar"
    }
  ];

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