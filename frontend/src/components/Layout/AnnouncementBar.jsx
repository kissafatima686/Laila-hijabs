import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/useContent';
import './AnnouncementBar.css';

const defaultAnnouncements = [
  "Free delivery across Pakistan on orders above Rs. 4,000 · Order via WhatsApp",
  "New High Summer 2026 Collection Available Now · Shop Latest Arrivals",
  "Special Offer: Use Code LAILA10 for 10% Off Your First Order",
  "Worldwide Shipping Available · Easy 14-Day Returns & Exchanges",
  "WhatsApp Order Assistance Available 24/7 · Chat With Us Today"
];

const AnnouncementBar = () => {
  const { getSectionContent } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Dynamic settings
  const isEnabled = getSectionContent('home_announcement_bar', 'is_enabled', 'true') !== 'false';
  const dynamicTitle = getSectionContent('home_announcement_bar', 'title', '');
  const bgColor = getSectionContent('home_announcement_bar', 'background_color', '');
  const textColor = getSectionContent('home_announcement_bar', 'text_color', '');

  const announcements = dynamicTitle ? [dynamicTitle] : defaultAnnouncements;

  useEffect(() => {
    if (announcements.length <= 1) return;
    
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
  }, [announcements.length]);

  if (!isEnabled) return null;

  return (
    <div 
      className="announce-wrapper" 
      style={{ 
        ...(bgColor ? { backgroundColor: bgColor } : {}),
        ...(textColor ? { color: textColor } : {})
      }}
    >
      <div className="announce-ticker-track">
        <span className={`announce-content ${fade ? 'fade-in' : 'fade-out'}`}>
          {announcements[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;