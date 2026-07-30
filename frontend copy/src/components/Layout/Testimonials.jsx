import { useState, useEffect } from 'react';
import './Testimonials.css';
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const initialReviewsData = [
  {
    name: "Anonymous",
    rating: 5,
    text: "Love their collections. Uniqueness, always purchase my modestwear from them x",
    date: "4 hours ago"
  },
  {
    name: "Shazia Parveen",
    rating: 5,
    text: "I have bought many dresses from Laila Hijabs as it's so easy and fast. Returns are great with no hassle. Absolutely love the material and designs are so unique.",
    image: "/Categories/abaya/abaya1.png",
    location: "London, GB",
    date: "4 days ago"
  },
  {
    name: "Sobia Beach",
    rating: 4,
    text: "I just bought three dresses from Laila Hijabs online - the chine abaya is absolutely brilliant. Flattering fit and luxury feel. 5 out of 5 from me. The tea pink maxi was perfect for the heat wave we have just had... very comfortable and a generous fit. The blue retro maxi is well structured and...",
    date: "4 days ago"
  },
  {
    name: "Anonymous",
    rating: 5,
    text: "I am so impressed with my recent abaya purchase! The quality of the fabric is absolutely amazing - it feels luxurious, looks stunning, and flows beautifully. The delivery was incredibly fast, which I really appreciated. I did end up needing a bigger size, but the exchange...",
    date: "4 days ago"
  }
];

const getStoredUserReviews = () => {
  try {
    const saved = localStorage.getItem('laila_user_reviews');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(r => ({
        name: r.author || 'Customer',
        rating: r.rating || 5,
        text: r.comment || r.title || '',
        image: r.parcelImage || null,
        location: 'Verified Buyer',
        date: 'Just now'
      }));
    }
  } catch(e) {}
  return [];
};

const Testimonials = () => {
  const [userReviews, setUserReviews] = useState(getStoredUserReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleReviewAdded = () => {
      setUserReviews(getStoredUserReviews());
    };
    window.addEventListener('reviewAdded', handleReviewAdded);
    window.addEventListener('storage', handleReviewAdded);
    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded);
      window.removeEventListener('storage', handleReviewAdded);
    };
  }, []);

  const combinedReviews = [...userReviews, ...initialReviewsData];
  const displayReviews = [...combinedReviews, ...combinedReviews, ...combinedReviews];
  const totalOriginal = combinedReviews.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    if (currentIndex >= totalOriginal) {
      setNoTransition(true);
      setCurrentIndex(0);
      setTimeout(() => {
        setNoTransition(false);
        setCurrentIndex(1);
      }, 20);
    } else {
      setNoTransition(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex <= 0) {
      setNoTransition(true);
      setCurrentIndex(totalOriginal);
      setTimeout(() => {
        setNoTransition(false);
        setCurrentIndex(totalOriginal - 1);
      }, 20);
    } else {
      setNoTransition(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, totalOriginal]);

  return (
    <section 
      className="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-layout">
        {/* Left Rating Summary Block */}
        <div className="rating-summary-block">
          <h3>Excellent</h3>
          <div className="stars-row">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="half-star" />
          </div>
          <p className="average-rating">4.35 average</p>
          <p className="reviews-count-text">{1561 + userReviews.length} reviews</p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="testimonials-slider-panel">
          <button className="slider-arrow prev-arrow" onClick={handlePrev} aria-label="Previous reviews">
            <FaChevronLeft />
          </button>

          <div className="slider-viewport">
            <div 
              className="slider-track"
              style={{
                transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * 340}px)`,
                transition: noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {displayReviews.map((r, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-header">
                    <div>
                      <h4 className="reviewer-name">{r.name}</h4>
                      <div className="verified-badge">
                        <FaCheckCircle className="check-icon" /> Verified Customer
                      </div>
                    </div>
                    <div className="card-stars">
                      {[...Array(5)].map((_, idx) => (
                        <FaStar key={idx} className={idx < r.rating ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                  </div>
                  <p className="testimonial-text">{r.text}</p>
                  <div className="testimonial-footer">
                    {r.image && (
                      <div className="testimonial-product-thumb">
                        <img src={r.image} alt="Purchased item" />
                      </div>
                    )}
                    <div className="review-meta">
                      {r.location && <span className="reviewer-location">{r.location}</span>}
                      <span className="review-date">{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-arrow next-arrow" onClick={handleNext} aria-label="Next reviews">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;