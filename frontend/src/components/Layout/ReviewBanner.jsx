import React from 'react';
import { useContent } from '../../context/useContent';
import "./ReviewBanner.css";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ReviewBanner = () => {
  const { getSectionContent } = useContent();
  const isEnabled = getSectionContent('home_review_banner', 'is_enabled', 'true') !== 'false';
  const title = getSectionContent('home_review_banner', 'title', 'Our customers say Excellent');
  const subtitle = getSectionContent('home_review_banner', 'subtitle', '4.3 based on 1,561 reviews');
  const starCount = parseFloat(getSectionContent('home_review_banner', 'star_count', '4.5')) || 4.5;
  
  if (!isEnabled) return null;

  return (
    <div className="review-banner">
      <span>{title}</span>
      <div className="stars">
        {[...Array(Math.floor(starCount))].map((_, i) => <FaStar key={`full-${i}`} />)}
        {starCount % 1 !== 0 && <FaStarHalfAlt />}
      </div>
      <span>{subtitle}</span>
    </div>
  );
};

export default ReviewBanner;