import { useState, useRef, useEffect } from 'react';
import './Testimonials.css';
import { FaStar, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviewsData = [
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

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      const scrollAmount = isMobile ? clientWidth : 340; // 320px card + 20px gap
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        viewportRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      const scrollAmount = isMobile ? clientWidth : 340;
      if (scrollLeft <= 10) {
        viewportRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isMobile]);

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
          <p className="reviews-count-text">1,561 reviews</p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="testimonials-slider-panel">
          <button className="slider-arrow prev-arrow" onClick={handlePrev} aria-label="Previous reviews">
            <FaChevronLeft />
          </button>

          <div className="slider-viewport" ref={viewportRef}>
            <div className="slider-track">
              {reviewsData.concat(reviewsData).concat(reviewsData).map((r, i) => (
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
                    <span className="testimonial-date">
                      {r.location ? `${r.location}, ` : ''}{r.date}
                    </span>
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