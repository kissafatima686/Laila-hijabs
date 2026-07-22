import "./ReviewBanner.css";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ReviewBanner = () => {
  return (
    <div className="review-banner">
      <span>Our customers say Excellent</span>
      <div className="stars">
        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalfAlt />
      </div>
      <span>4.3 based on 1,561 reviews</span>
    </div>
  );
};

export default ReviewBanner;