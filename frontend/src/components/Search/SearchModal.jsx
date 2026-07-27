// src/components/Search/SearchModal.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import './SearchModal.css';

// Sample product catalog for searching (Replace with your actual global product data later)
const searchCatalog = [
  {
    slug: "lamia-open-kaftan-set",
    name: "LAMIA OPEN KAFTAN SET",
    price: 99.00,
    color: "Burgundy",
    category: "Kaftans",
    image: "https://via.placeholder.com/80x100"
  },
  {
    slug: "pleated-satin-abaya",
    name: "PLEATED SATIN ABAYA",
    price: 85.00,
    color: "Olive",
    category: "Abayas",
    image: "https://via.placeholder.com/80x100"
  },
  {
    slug: "embroidered-chiffon-hijab",
    name: "EMBROIDERED CHIFFON HIJAB",
    price: 25.00,
    color: "Rose Gold",
    category: "Hijabs",
    image: "https://via.placeholder.com/80x100"
  },
  {
    slug: "everyday-modal-hijab",
    name: "EVERYDAY MODAL HIJAB",
    price: 18.00,
    color: "Black",
    category: "Hijabs",
    image: "https://via.placeholder.com/80x100"
  }
];

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Close modal when pressing the 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Clear search term when modal closes so it's fresh next time
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter products by Name, Color, or Category
  const filteredProducts = searchCatalog.filter((product) => {
    const query = searchTerm.trim().toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.color.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Search Input Header */}
        <div className="search-header">
          <IoSearchOutline size={22} className="search-input-icon" />
          <input
            type="text"
            placeholder="Search by product name, color, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button className="close-search-btn" onClick={onClose} aria-label="Close search">
            <IoCloseOutline size={26} />
          </button>
        </div>

        {/* Live Search Results */}
        <div className="search-results-section">
          {searchTerm.trim() === '' ? (
            <div className="search-suggestions">
              <p className="suggestion-title">Popular Searches</p>
              <div className="suggestion-tags">
                <button type="button" onClick={() => setSearchTerm('Abaya')}>Abaya</button>
                <button type="button" onClick={() => setSearchTerm('Kaftan')}>Kaftan</button>
                <button type="button" onClick={() => setSearchTerm('Hijab')}>Hijab</button>
                <button type="button" onClick={() => setSearchTerm('Burgundy')}>Burgundy</button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No products found matching "<strong>{searchTerm}</strong>"</p>
              <span>Try checking your spelling or searching for a different keyword.</span>
            </div>
          ) : (
            <div className="results-list">
              <p className="results-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found</p>
              {filteredProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={`/Products/${product.slug}`}
                  className="search-result-item"
                  onClick={onClose}
                >
                  <img src={product.image} alt={product.name} className="result-img" />
                  <div className="result-info">
                    <h4>{product.name}</h4>
                    <span className="result-meta">{product.category} | Color: {product.color}</span>
                    <span className="result-price">£{product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;