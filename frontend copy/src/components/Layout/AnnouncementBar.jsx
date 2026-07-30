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

  const metaRaw = getSectionContent('home_announcement_bar', 'metadata', {});
  let meta = {};
  try { meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : (metaRaw || {}); } catch(e) {}

  const activeSlides = Array.isArray(meta.slides) 
    ? meta.slides.filter(s => s.status === 'Active' && s.value).map(s => s.value) 
    : [];

  const announcements = activeSlides.length > 0 ? activeSlides : (dynamicTitle ? [dynamicTitle] : defaultAnnouncements);
  const finalBgColor = meta.background_color || bgColor;
  const finalTextColor = meta.text_color || textColor;
  const speedMs = (parseInt(meta.slide_speed || '4', 10) || 4) * 1000;

  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setFade(true);
      }, 300);
    }, speedMs);

    return () => clearInterval(interval);
  }, [announcements.length, speedMs]);

  if (!isEnabled || (meta.is_enabled === 'false')) return null;

  return (
    <div 
      className="announce-wrapper" 
      style={{ 
        ...(finalBgColor ? { backgroundColor: finalBgColor } : {}),
        ...(finalTextColor ? { color: finalTextColor } : {})
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