import React, { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const announcements = [
  "Free delivery across Pakistan on orders above Rs. 4,000 · Order via WhatsApp",
  "New High Summer 2026 Collection Available Now · Shop Latest Arrivals",
  "Special Offer: Use Code LAILA10 for 10% Off Your First Order",
  "Worldwide Shipping Available · Easy 14-Day Returns & Exchanges",
  "WhatsApp Order Assistance Available 24/7 · Chat With Us Today"
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger fade out animation
      setFade(false);

      // Wait for fade out to finish, then update text and fade back in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setFade(true);
      }, 300); // 300ms matches CSS transition duration
    }, 4000); // Changes message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="announce-wrapper">
      <div className="announce-ticker-track">
        <span className={`announce-content ${fade ? 'fade-in' : 'fade-out'}`}>
          {announcements[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;