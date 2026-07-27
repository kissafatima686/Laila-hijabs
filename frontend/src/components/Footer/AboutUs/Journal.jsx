// src/components/Footer/AboutUs/Journal.jsx
import React from 'react';
import '../FooterPage.css';

const Journal = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>Journal</h1>
      <p>Explore our latest stories, style tips, and insights into the world of Laila Hijabs.</p>
      
      <div className="journal-entries">
        <article>
          <h2>Style Guide: Summer Trends</h2>
          <p>Discover the best ways to style your favorite pieces this season.</p>
        </article>
        <article>
          <h2>Behind the Scenes</h2>
          <p>A look at how we design and craft our collections.</p>
        </article>
      </div>
      </div>
    </div>
  );
};

export default Journal;