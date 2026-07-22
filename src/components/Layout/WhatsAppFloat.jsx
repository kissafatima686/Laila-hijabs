import React from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/923238399480" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="global-wa-float" 
      aria-label="Chat on WhatsApp"
    >
      <IoLogoWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppFloat;
