// src/pages/LocationDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  IoLocationOutline, 
  IoCallOutline, 
  IoLogoWhatsapp, 
  IoTimeOutline, 
  IoMailOutline, 
  IoNavigateOutline,
  IoArrowBackOutline
} from 'react-icons/io5';
import './LocationDetailPage.css';

export const locationsData = {
  1: {
    id: 1,
    name: "Laila Hijabs Flagship Studio",
    city: "Islamabad, Pakistan",
    address: "Office #22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan",
    phone: "+92 323 8399480",
    whatsapp: "+923238399480",
    email: "islamabad@lailahijabs.com",
    hours: "Monday – Saturday: 11:00 AM – 8:00 PM",
    image: "/hero2.png",
    mapUrl: "https://maps.google.com/maps?q=Pakland+City+Center+I-8+Markaz+Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Pakland+City+Center+I-8+Markaz+Islamabad",
    description: "Welcome to our main Flagship Studio in Islamabad. Experience our full collection of premium chiffon, silk hijabs, traditional Chadars, and hand-tailored abayas in person. Private styling sessions available."
  },
  2: {
    id: 2,
    name: "Laila Hijabs Boutique & Experience Center",
    city: "Dubai, UAE",
    address: "Business Village Block-B, 3rd Floor, Office 301, Deira, Dubai, UAE",
    phone: "+971 4 234 5678",
    whatsapp: "+923238399480",
    email: "dubai@lailahijabs.com",
    hours: "Sunday – Friday: 10:00 AM – 9:00 PM",
    image: "/Categories/abaya/abaya1.png",
    mapUrl: "https://maps.google.com/maps?q=Business+Village+Deira+Dubai&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Business+Village+Deira+Dubai",
    description: "Our Dubai boutique offers an exclusive selection of luxury modest wear, bespoke abayas, and bridal hijab styling for customers across the Emirates."
  },
  3: {
    id: 3,
    name: "Laila Hijabs Fabric Experience Studio",
    city: "Lahore, Pakistan",
    address: "MM Alam Road, Block B2, Gulberg III, Lahore, Pakistan",
    phone: "+92 323 8399480",
    whatsapp: "+923238399480",
    email: "lahore@lailahijabs.com",
    hours: "Monday – Saturday: 11:30 AM – 8:30 PM",
    image: "/Categories/hijabs.png",
    mapUrl: "https://maps.google.com/maps?q=MM+Alam+Road+Gulberg+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=MM+Alam+Road+Gulberg+Lahore",
    description: "Located in the heart of Lahore's fashion district, our studio brings you tactile fabric samples, custom fittings, and personal consultations."
  },
  4: {
    id: 4,
    name: "Laila Hijabs Traditional Chadar Studio",
    city: "Rawalpindi, Pakistan",
    address: "Commercial Market, B-Block, Satellite Town, Rawalpindi, Pakistan",
    phone: "+92 323 8399480",
    whatsapp: "+923238399480",
    email: "rawalpindi@lailahijabs.com",
    hours: "Monday – Saturday: 11:00 AM – 8:00 PM",
    image: "/Categories/iranichadar.png",
    mapUrl: "https://maps.google.com/maps?q=Commercial+Market+Rawalpindi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Commercial+Market+Rawalpindi",
    description: "Specializing in Irani Chadars, Namaz Chadars, and everyday round chadars crafted with authentic breathable cottons and silks."
  },
  5: {
    id: 5,
    name: "Laila Hijabs Jilbab Experience Center",
    city: "Karachi, Pakistan",
    address: "Clifton Block 5, Near Ocean Mall, Karachi, Pakistan",
    phone: "+92 323 8399480",
    whatsapp: "+923238399480",
    email: "karachi@lailahijabs.com",
    hours: "Monday – Saturday: 12:00 PM – 9:00 PM",
    image: "/Categories/jilbab.png",
    mapUrl: "https://maps.google.com/maps?q=Clifton+Block+5+Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Clifton+Block+5+Karachi",
    description: "Explore 2-piece and overhead jilbabs along with breathable cotton wraps tailored for seaside humidity and active daily routines."
  },
  6: {
    id: 6,
    name: "Laila Hijabs Prayer Wear Studio",
    city: "Peshawar, Pakistan",
    address: "University Road, Near Saddar, Peshawar, Pakistan",
    phone: "+92 323 8399480",
    whatsapp: "+923238399480",
    email: "peshawar@lailahijabs.com",
    hours: "Monday – Saturday: 11:00 AM – 8:00 PM",
    image: "/Categories/namazchadar.png",
    mapUrl: "https://maps.google.com/maps?q=University+Road+Peshawar&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=University+Road+Peshawar",
    description: "Dedicated studio showcasing prayer dresses, Namaz Chadars, and everyday modest wear crafted with care and premium fabrications."
  }
};

const LocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const locationId = id ? parseInt(id, 10) : 1;
  const location = locationsData[locationId] || locationsData[1];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="location-page-wrapper">
      <div className="wrap">
        {/* Navigation / Breadcrumb */}
        <div className="location-nav-bar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IoArrowBackOutline size={18} />
            <span>Back</span>
          </button>
          <div className="crumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/about">About Us</Link><span>/</span>
            <span>{location.city}</span>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="location-hero">
          <div className="location-hero-content">
            <span className="eyebrow">{location.city}</span>
            <h1>{location.name}</h1>
            <p>{location.description}</p>
          </div>
          <div className="location-hero-image">
            <img src={location.image} alt={location.name} />
          </div>
        </div>

        {/* Details & Map Grid */}
        <div className="location-details-grid">
          {/* Info Card Column */}
          <div className="info-card">
            <h2>Location & Contact Details</h2>
            
            <div className="info-item">
              <div className="icon-wrapper">
                <IoLocationOutline size={22} />
              </div>
              <div className="info-text">
                <h3>Full Address</h3>
                <p>{location.address}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <IoTimeOutline size={22} />
              </div>
              <div className="info-text">
                <h3>Opening Hours</h3>
                <p>{location.hours}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <IoCallOutline size={22} />
              </div>
              <div className="info-text">
                <h3>Phone & Support</h3>
                <p>{location.phone}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <IoMailOutline size={22} />
              </div>
              <div className="info-text">
                <h3>Email Address</h3>
                <p>{location.email}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="action-buttons">
              <a 
                href={`https://wa.me/${location.whatsapp}?text=Hi%20Laila%20Hijabs!%20I%20would%20like%20to%20visit%20the%20${encodeURIComponent(location.name)}.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary wa-btn"
              >
                <IoLogoWhatsapp size={20} />
                Book Visit on WhatsApp
              </a>

              <a 
                href={location.directionsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-ghost directions-btn"
              >
                <IoNavigateOutline size={20} />
                Get Directions
              </a>
            </div>
          </div>

          {/* Google Maps Embed Column */}
          <div className="map-card">
            <h2>Find Us on Google Maps</h2>
            <div className="map-iframe-container">
              <iframe
                title={`Google Map - ${location.name}`}
                src={location.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailPage;
