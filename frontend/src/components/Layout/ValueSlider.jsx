import { useState, useEffect } from 'react';
import './ValueSlider.css';

const ValueSlider = () => {
  const slides = [
    { 
      title: "A FEMALE-LED INDEPENDENT WOMENSWEAR BRAND", 
      text: "We prioritise small-batch production to ensure every piece is made with care and designed to last." 
    },
    { 
      title: "WE OFFER SIZE & LENGTH OPTIONS", 
      text: "We don’t believe one length fits all. Our dresses are designed around coverage, without plunging necklines or awkward slits." 
    },
    { 
      title: "ELEGANT MODESTY & PREMIUM FABRICS", 
      text: "Designed in Lahore with luxury silk, crepe, and chiffon crafted for timeless style and effortless comfort." 
    }
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setFade(true);
    }, 200);
  };

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setFade(true);
    }, 200);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      next();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, index]);

  return (
    <section 
      className="value-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="value-slider-box">
        <button onClick={prev} className="nav-btn" aria-label="Previous slide">‹</button>
        <div className={`slide-content ${fade ? 'active' : 'animating'}`}>
          <h3>{slides[index].title}</h3>
          <p>{slides[index].text}</p>
        </div>
        <button onClick={next} className="nav-btn" aria-label="Next slide">›</button>
      </div>
      
      {/* Slider indicators */}
      <div className="value-indicators">
        {slides.map((_, i) => (
          <span 
            key={i} 
            className={`indicator-dot ${i === index ? 'active' : ''}`} 
            onClick={() => { setFade(false); setTimeout(() => { setIndex(i); setFade(true); }, 200); }}
          />
        ))}
      </div>
    </section>
  );
};

export default ValueSlider;