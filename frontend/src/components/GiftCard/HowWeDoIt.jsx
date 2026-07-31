import React from 'react';
import './HowWeDoIt.css';
import '../Footer/FooterPage.css';
import * as FaIcons from 'react-icons/fa';
import { useContent } from '../../context/useContent';

const HowWeDoIt = () => {
  const { getSectionContent } = useContent();

  const fallbackItems = [
    { icon_name: "FaCut", text: "DIRECT TO CONSUMER" },
    { icon_name: "FaUserTie", text: "DESIGNED IN HOUSE" },
    { icon_name: "FaTools", text: "NO MASS PRODUCTION" },
    { icon_name: "FaStore", text: "SUPPORTING SMALL FACTORIES" },
    { icon_name: "FaDesktop", text: "ONLINE & CONCESSIONS" },
  ];

  const title = getSectionContent('gift_card', 'title', 'HOW WE DO IT');
  const subtitle = getSectionContent('gift_card', 'subtitle', '');
  const bodyContent = getSectionContent('gift_card', 'body_content', '');
  const buttonText = getSectionContent('gift_card', 'button_text', '');
  const buttonLink = getSectionContent('gift_card', 'button_link', '');
  const items = getSectionContent('gift_card', 'icon_grid', fallbackItems);

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>{title}</h1>
        {subtitle && <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '20px', color: '#182012' }}>{subtitle}</h2>}
        {bodyContent && <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.6', color: '#555' }}>{bodyContent}</p>}
        <div className="how-we-do-it-container">
          <div className="features-grid">
            {(Array.isArray(items) && items.length > 0 ? items : fallbackItems)
              .filter(item => item.status !== 'Hidden' && item.status !== 'Draft' && item.status !== 'Inactive')
              .map((item, index) => {
                const iconKey = item.icon_name || item.icon || 'FaRegCircle';
                const IconComponent = FaIcons[iconKey] || FaIcons.FaRegCircle;
                const displayText = item.text || item.title || item.label || '';
                return (
                  <div key={index} className="feature-item">
                    <div className="icon"><IconComponent /></div>
                    <p>{displayText}</p>
                  </div>
                );
              })}
          </div>
        </div>
        {buttonText && buttonLink && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href={buttonLink} className="action-button primary">
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HowWeDoIt;