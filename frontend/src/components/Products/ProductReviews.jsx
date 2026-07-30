import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ProductReviews.css';

const getInitialStoredReviews = () => {
  try {
    const saved = localStorage.getItem('laila_user_reviews');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch(e) {}
  return [];
};

const ProductReviews = ({ product }) => {
  // Read saved reviews from localStorage on initialization
  const [reviews, setReviews] = useState(getInitialStoredReviews);
  const [isOpen, setIsOpen] = useState(false); // Closed by default
  const [activeFilter, setActiveFilter] = useState('relevant'); // 'relevant', 'bad', 'newest', 'oldest'
  const [onlyPhotos, setOnlyPhotos] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Form State - Rating starts at 0 (unselected)
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    rating: 0,
    title: '',
    comment: '',
    parcelImage: null,
    parcelImagePreview: null
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('laila_user_reviews');
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  // Handle Helpfulness Upvote
  const handleHelpfulClick = (id) => {
    setReviews(prev => {
      const updated = prev.map(rev => {
        if (rev.id === id) {
          const nextVoted = !rev.userVoted;
          return {
            ...rev,
            userVoted: nextVoted,
            helpfulCount: nextVoted ? rev.helpfulCount + 1 : rev.helpfulCount - 1
          };
        }
        return rev;
      });
      try {
        localStorage.setItem('laila_user_reviews', JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          parcelImage: reader.result,
          parcelImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setRatingError(true);
      return;
    }
    setRatingError(false);

    if (!formData.author.trim() || !formData.comment.trim()) return;

    const newReview = {
      id: Date.now(),
      productId: product.id,
      author: formData.author.trim(),
      date: new Date().toISOString().split('T')[0],
      rating: Number(formData.rating),
      verified: true,
      title: formData.title.trim() || "Customer Review",
      comment: formData.comment.trim(),
      parcelImage: formData.parcelImagePreview,
      helpfulCount: 0,
      userVoted: false
    };

    const updatedList = [newReview, ...reviews];
    setReviews(updatedList);
    
    // Save to localStorage & notify Testimonials banner
    try {
      localStorage.setItem('laila_user_reviews', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('reviewAdded'));
    } catch(e) {}

    setFormSuccess(true);
    setIsOpen(true); // Automatically expand accordion to see newly added review and stars!
    setTimeout(() => {
      setFormSuccess(false);
      setShowReviewModal(false);
      setFormData({
        author: '',
        email: '',
        rating: 0,
        title: '',
        comment: '',
        parcelImage: null,
        parcelImagePreview: null
      });
    }, 1500);
  };

  // Filter & Sort Logic
  const productReviews = reviews.filter(r => String(r.productId) === String(product.id));
  
  const getFilteredReviews = () => {
    let list = [...productReviews];

    if (onlyPhotos) {
      list = list.filter(r => Boolean(r.parcelImage));
    }

    switch (activeFilter) {
      case 'bad':
        return list.filter(r => r.rating <= 2).sort((a, b) => a.rating - b.rating);
      case 'newest':
        return list.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return list.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'relevant':
      default:
        return list.sort((a, b) => (b.rating * 10 + b.helpfulCount) - (a.rating * 10 + a.helpfulCount));
    }
  };

  const filteredReviews = getFilteredReviews();

  // Statistics calculation
  const totalReviews = productReviews.length;
  const avgRating = totalReviews > 0 
    ? (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: productReviews.filter(r => r.rating === star).length,
    percentage: totalReviews > 0 
      ? Math.round((productReviews.filter(r => r.rating === star).length / totalReviews) * 100)
      : 0
  }));

  const renderStars = (ratingCount) => {
    if (ratingCount === 0) return null;
    return (
      <div className="stars-row" title={`${ratingCount} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star-icon ${star <= ratingCount ? 'filled' : 'empty'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="product-reviews-section">
      <div className="reviews-container">

        {/* Collapsible Accordion Header matching FABRIC & FIT style */}
        <div className={`reviews-accordion-bar ${isOpen ? 'is-open' : ''}`}>
          <div 
            className="reviews-accordion-header-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="header-title-left">
              <span className="reviews-accordion-title">REVIEWS & COMMENTS ({totalReviews})</span>
              <div className="header-rating-preview">
                {totalReviews > 0 ? (
                  <>
                    {renderStars(Math.round(Number(avgRating)))}
                    <span className="header-score-text">{avgRating} / 5</span>
                  </>
                ) : (
                  <span className="header-score-text no-reviews-text">No reviews yet</span>
                )}
              </div>
            </div>

            <div className="header-actions-right">
              {/* Add Review Popup Button right on the Header */}
              <button 
                type="button" 
                className="header-add-review-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewModal(true);
                }}
              >
                + ADD REVIEW
              </button>

              <span className="accordion-icon">{isOpen ? '—' : '∨'}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Content Body */}
        {isOpen && (
          <div className="reviews-expanded-content">

            {/* Rating Summary Card & Statistics */}
            {totalReviews > 0 ? (
              <div className="rating-summary-card">
                <div className="overall-score-box">
                  <div className="big-rating-number">{avgRating}</div>
                  {renderStars(Math.round(Number(avgRating)))}
                  <p className="total-reviews-label">Based on {totalReviews} customer reviews</p>
                  <div className="verified-buyer-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>100% Verified Parcel Deliveries</span>
                  </div>
                </div>

                <div className="stars-breakdown-box">
                  {starCounts.map(({ star, count, percentage }) => (
                    <div key={star} className="breakdown-row">
                      <span className="star-level-text">{star} Stars</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="count-text">{count}</span>
                    </div>
                  ))}
                </div>

                <div className="parcel-highlight-box">
                  <h4>📦 Real Customer Parcel Photos</h4>
                  <p>See actual unboxings uploaded by verified buyers after receiving their package.</p>
                  <button 
                    type="button"
                    className={`photo-toggle-btn ${onlyPhotos ? 'active' : ''}`}
                    onClick={() => setOnlyPhotos(!onlyPhotos)}
                  >
                    {onlyPhotos ? '✓ Showing Photos Only' : '📷 Filter Reviews With Photos'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Filters & Sort Toolbar */}
            {totalReviews > 0 && (
              <div className="reviews-filter-bar">
                <div className="filter-chips">
                  <span className="filter-title">FILTER BY:</span>
                  <button 
                    type="button"
                    className={`filter-chip ${activeFilter === 'relevant' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('relevant')}
                  >
                    Relevant / Top Rated
                  </button>
                  <button 
                    type="button"
                    className={`filter-chip ${activeFilter === 'bad' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('bad')}
                  >
                    Bad Reviews (1-2★)
                  </button>
                  <button 
                    type="button"
                    className={`filter-chip ${activeFilter === 'newest' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('newest')}
                  >
                    Newest
                  </button>
                  <button 
                    type="button"
                    className={`filter-chip ${activeFilter === 'oldest' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('oldest')}
                  >
                    Oldest
                  </button>
                </div>

                <div className="results-count-text">
                  Showing <strong>{filteredReviews.length}</strong> of <strong>{totalReviews}</strong> reviews
                </div>
              </div>
            )}

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div className="no-reviews-box">
                <p>{totalReviews === 0 ? 'No reviews yet for this product. Be the first to share your experience and upload your parcel photo!' : 'No reviews match your selected filter criteria.'}</p>
                <button 
                  type="button" 
                  className="reset-filter-btn"
                  onClick={() => setShowReviewModal(true)}
                >
                  + WRITE THE FIRST REVIEW
                </button>
              </div>
            ) : (
              <div className="reviews-list-grid">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className={`review-card ${rev.rating <= 2 ? 'critical-review' : ''}`}>
                    <div className="review-card-header">
                      <div>
                        <div className="reviewer-info">
                          <span className="author-name">{rev.author}</span>
                          {rev.verified && (
                            <span className="verified-tag">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="review-date-stars">
                          {renderStars(rev.rating)}
                          <span className="review-date">{rev.date}</span>
                        </div>
                      </div>

                      {rev.rating <= 2 && (
                        <span className="critical-badge">Critical Review</span>
                      )}
                    </div>

                    <h3 className="review-title">{rev.title}</h3>
                    <p className="review-comment">{rev.comment}</p>

                    {/* Parcel Photo Attachment */}
                    {rev.parcelImage && (
                      <div className="parcel-image-container">
                        <span className="parcel-tag">RECEIVED PARCEL PHOTO:</span>
                        <div 
                          className="parcel-thumbnail-box" 
                          onClick={() => setPreviewImageModal(rev.parcelImage)}
                          title="Click to expand parcel image"
                        >
                          <img src={rev.parcelImage} alt="Customer parcel photo" />
                          <div className="zoom-overlay">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                              <circle cx="11" cy="11" r="8"/>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                              <line x1="11" y1="8" x2="11" y2="14"/>
                              <line x1="8" y1="11" x2="14" y2="11"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Footer: Helpful button */}
                    <div className="review-card-footer">
                      <span className="was-helpful-text">Was this review helpful?</span>
                      <button 
                        type="button" 
                        className={`helpful-btn ${rev.userVoted ? 'voted' : ''}`}
                        onClick={() => handleHelpfulClick(rev.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={rev.userVoted ? "#2A2A22" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                        </svg>
                        <span>Yes ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Write Review & Upload Parcel Photo (Rendered in Document Body Portal to avoid cutoff) */}
        {showReviewModal && createPortal(
          <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
            <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3>WRITE A CUSTOMER REVIEW</h3>
                  <p className="modal-subtitle">Share your experience & upload a picture of your received parcel</p>
                </div>
                <button 
                  type="button" 
                  className="close-modal-btn" 
                  onClick={() => setShowReviewModal(false)}
                >
                  ✕
                </button>
              </div>

              {formSuccess ? (
                <div className="form-success-box">
                  <div className="success-icon">✓</div>
                  <h4>Thank You for Your Feedback!</h4>
                  <p>Your review and parcel picture have been posted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="review-form">
                  {/* Rating Selector */}
                  <div className="form-group">
                    <label className="form-label">OVERALL RATING *</label>
                    <div className="interactive-stars-picker">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-pick-btn ${star <= formData.rating ? 'selected' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, rating: star });
                            setRatingError(false);
                          }}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-num-label">
                        {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate (1 to 5 stars)'}
                      </span>
                    </div>
                    {ratingError && (
                      <span style={{ color: '#D9534F', fontSize: '11px', fontWeight: '600', marginTop: '4px' }}>
                        * Please select a rating score between 1 and 5 stars.
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">YOUR NAME *</label>
                      <input 
                        type="text" 
                        required
                        className="form-input" 
                        placeholder="e.g. Fatima Khan"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">YOUR EMAIL *</label>
                      <input 
                        type="email" 
                        required
                        className="form-input" 
                        placeholder="e.g. fatima@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">REVIEW TITLE</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Beautiful fabric and fast shipping"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">YOUR REVIEW & COMMENTS *</label>
                    <textarea 
                      required
                      rows="4" 
                      className="form-textarea" 
                      placeholder="Describe the fabric, fit, color accuracy, and parcel unboxing experience..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    />
                  </div>

                  {/* Parcel Image Upload Field */}
                  <div className="form-group upload-group">
                    <label className="form-label">UPLOAD RECEIVED PARCEL PHOTO (OPTIONAL)</label>
                    <div className="upload-dropzone">
                      <input 
                        type="file" 
                        accept="image/*"
                        id="parcel-upload-input"
                        className="file-input-hidden"
                        onChange={handlePhotoUpload}
                      />
                      <label htmlFor="parcel-upload-input" className="file-input-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2A22" strokeWidth="1.6">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Choose parcel photo from your device</span>
                      </label>

                      {formData.parcelImagePreview && (
                        <div className="image-preview-badge">
                          <img src={formData.parcelImagePreview} alt="Parcel Preview" />
                          <button 
                            type="button" 
                            className="remove-img-btn"
                            onClick={() => setFormData({ ...formData, parcelImage: null, parcelImagePreview: null })}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                      CANCEL
                    </button>
                    <button type="submit" className="submit-review-btn">
                      SUBMIT REVIEW
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* Modal: Fullscreen Photo Lightbox */}
        {previewImageModal && createPortal(
          <div className="image-lightbox-overlay" onClick={() => setPreviewImageModal(null)}>
            <div className="image-lightbox-card" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="close-lightbox-btn" 
                onClick={() => setPreviewImageModal(null)}
              >
                ✕
              </button>
              <img src={previewImageModal} alt="Enlarged Customer Parcel Photo" className="lightbox-img" />
              <div className="lightbox-caption">
                📦 Customer Parcel Photo Verification
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </section>
  );
};

export default ProductReviews;
