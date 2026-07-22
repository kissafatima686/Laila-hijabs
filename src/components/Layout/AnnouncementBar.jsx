import './AnnouncementBar.css';

const announcements = [
  "Free delivery across Pakistan on orders above Rs. 4,000 · Order via WhatsApp",
  " New High Summer 2026 Collection Available Now · Shop Latest Arrivals",
  " Special Offer: Use Code LAILA10 for 10% Off Your First Order",
  " Worldwide Shipping Available · Easy 14-Day Returns & Exchanges",
  " WhatsApp Order Assistance Available 24/7 · Chat With Us Today"
];

const AnnouncementBar = () => {
  return (
    <div className="announce-wrapper">
      <div className="announce-marquee">
        <div className="marquee-content">
          {announcements.concat(announcements).map((item, idx) => (
            <span key={idx} className="marquee-item">
              <span>{item}</span>
              <span className="marquee-separator">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;