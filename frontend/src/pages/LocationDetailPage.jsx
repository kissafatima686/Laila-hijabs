import React, { useState, useEffect } from 'react';
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

const DEFAULT_LOCATIONS = {
  1: {
    id: 1,
    name: "Laila Hijabs Flagship Studio",
    city: "Lahore, Pakistan",
    address: "MM Alam Road, Gulberg III, Lahore, Pakistan",
    phone: "+92 42 35789000",
    whatsapp: "+923238399480",
    email: "info@lailahijabs.com",
    hours: "Monday – Saturday: 11:00 AM – 9:00 PM",
    image: "/hero1.png",
    mapUrl: "https://maps.google.com/maps?q=MM+Alam+Road+Gulberg+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=MM+Alam+Road+Gulberg+Lahore",
    description: "Welcome to our main Flagship Studio in Lahore. Experience our full collection of premium chiffon, silk hijabs, traditional Chadars, and hand-tailored abayas in person."
  },
  2: {
    id: 2,
    name: "Laila Hijabs Boutique Concession",
    city: "Karachi, Pakistan",
    address: "Dolmen Mall Clifton, 2nd Floor, Karachi",
    phone: "+92 21 35291234",
    whatsapp: "+923238399480",
    email: "info@lailahijabs.com",
    hours: "Monday – Saturday: 12:00 PM – 10:00 PM",
    image: "/hero2.png",
    mapUrl: "https://maps.google.com/maps?q=Dolmen+Mall+Clifton+Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Dolmen+Mall+Clifton+Karachi",
    description: "Our Karachi boutique offers an exclusive selection of luxury modest wear, bespoke abayas, and bridal hijab styling for customers."
  }
};

const LocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dbLocation, setDbLocation] = useState(null);

  const locId = id ? parseInt(id, 10) : 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_BASE}/api/admin/module/locations`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(l => String(l.location_id || l.id) === String(locId));
          if (found) setDbLocation(found);
        }
      })
      .catch(() => {});
  }, [id, locId]);

  const fallback = DEFAULT_LOCATIONS[locId] || DEFAULT_LOCATIONS[1];

  const location = dbLocation ? {
    id: dbLocation.location_id || dbLocation.id,
    name: dbLocation.name || dbLocation.store_name || fallback.name,
    city: dbLocation.city || fallback.city,
    address: dbLocation.address || fallback.address,
    phone: dbLocation.phone || fallback.phone,
    whatsapp: dbLocation.phone ? dbLocation.phone.replace(/[^0-9+]/g, '') : fallback.whatsapp,
    email: dbLocation.email || fallback.email,
    hours: dbLocation.hours || dbLocation.opening_hours || fallback.hours,
    image: dbLocation.image_url ? (dbLocation.image_url.startsWith('http') ? dbLocation.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${dbLocation.image_url.startsWith('/') ? '' : '/'}${dbLocation.image_url}`) : fallback.image,
    mapUrl: dbLocation.map_url || `https://maps.google.com/maps?q=${encodeURIComponent(dbLocation.address || fallback.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    directionsUrl: `https://maps.google.com/?q=${encodeURIComponent(dbLocation.address || fallback.address)}`,
    description: dbLocation.description || fallback.description,
    addressActive: dbLocation.address_active !== false,
    hoursActive: dbLocation.hours_active !== false,
    phoneActive: dbLocation.phone_active !== false,
    emailActive: dbLocation.email_active !== false,
    mapActive: dbLocation.map_active !== false,
    imageActive: dbLocation.image_active !== false,
    status: dbLocation.status
  } : fallback;

  if (dbLocation && dbLocation.status === 'Draft') {
    return (
      <div className="location-page-wrapper" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Location Currently Unavailable</h2>
        <p style={{ marginTop: '10px', color: '#6B7280' }}>This location details page is currently hidden by admin.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3E4930', color: '#F6F1E3', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Back to Home</button>
      </div>
    );
  }

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
            {location.description && <p>{location.description}</p>}
          </div>
          {location.imageActive !== false && location.image && (
            <div className="location-hero-image">
              <img src={location.image} alt={location.name} onError={(e) => { e.target.onerror = null; e.target.src = fallback.image; }} />
            </div>
          )}
        </div>

        {/* Details & Map Grid */}
        <div className="location-details-grid">
          {/* Info Card Column */}
          <div className="info-card">
            <h2>Location & Contact Details</h2>
            
            {location.addressActive !== false && location.address && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <IoLocationOutline size={22} />
                </div>
                <div className="info-text">
                  <h3>Full Address</h3>
                  <p>{location.address}</p>
                </div>
              </div>
            )}

            {location.hoursActive !== false && location.hours && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <IoTimeOutline size={22} />
                </div>
                <div className="info-text">
                  <h3>Opening Hours</h3>
                  <p>{location.hours}</p>
                </div>
              </div>
            )}

            {location.phoneActive !== false && location.phone && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <IoCallOutline size={22} />
                </div>
                <div className="info-text">
                  <h3>Phone & Support</h3>
                  <p>{location.phone}</p>
                </div>
              </div>
            )}

            {location.emailActive !== false && location.email && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <IoMailOutline size={22} />
                </div>
                <div className="info-text">
                  <h3>Email Address</h3>
                  <p>{location.email}</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="action-buttons">
              {location.phone && (
                <a 
                  href={`https://wa.me/${location.whatsapp}?text=Hi%20Laila%20Hijabs!%20I%20would%20like%20to%20visit%20the%20${encodeURIComponent(location.name)}.`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary wa-btn"
                >
                  <IoLogoWhatsapp size={20} />
                  Book Visit on WhatsApp
                </a>
              )}

              {location.address && (
                <a 
                  href={location.directionsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-ghost directions-btn"
                >
                  <IoNavigateOutline size={20} />
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Google Maps Embed Column */}
          {location.mapActive !== false && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetailPage;
