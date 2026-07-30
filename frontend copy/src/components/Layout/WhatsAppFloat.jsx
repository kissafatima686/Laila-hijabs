import React from 'react';
import { useContent } from '../../context/useContent';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const { getSectionContent } = useContent();
  const isEnabled = getSectionContent('home_whatsapp_float', 'is_enabled', 'true') !== 'false';
  const phone = getSectionContent('home_whatsapp_float', 'phone', '923238399480');
  const message = getSectionContent('home_whatsapp_float', 'message', '');
  const position = getSectionContent('home_whatsapp_float', 'position', 'bottom-right');

  if (!isEnabled) return null;

  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`global-wa-float ${position === 'bottom-left' ? 'pos-left' : 'pos-right'}`}
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
      style={position === 'bottom-left' ? { left: '20px', right: 'auto' } : {}}
    >
      <svg viewBox="0 0 32 32" width="32" height="32" fill="#ffffff">
        <path d="M16 2a13.93 13.93 0 0 0-12 21L2 30l7.24-1.9A13.93 13.93 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.87-1.6l-.42-.25-4.36 1.14 1.16-4.25-.28-.44a11.53 11.53 0 1 1 9.77 5.4zm6.33-8.64c-.35-.17-2.06-1.02-2.38-1.13s-.55-.17-.79.17-.92 1.13-1.13 1.37-.42.26-.77.09a9.7 9.7 0 0 1-2.86-1.77 10.7 10.7 0 0 1-1.98-2.47c-.2-.35-.02-.54.15-.71.16-.16.35-.42.53-.63s.24-.35.35-.58a.7.7 0 0 0 0-.66c-.09-.17-.79-1.9-.11-2.61s-.62-.6-.85-.61h-.73a1.4 1.4 0 0 0-1 .47A4.26 4.26 0 0 0 8 13.52a7.44 7.44 0 0 0 1.56 3.93 17 17 0 0 0 6.54 5.77c2.14.93 2.97.94 4.07.78a3.47 3.47 0 0 0 2.29-1.61 2.84 2.84 0 0 0 .2-1.61c-.08-.15-.26-.24-.61-.41z"/>
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
