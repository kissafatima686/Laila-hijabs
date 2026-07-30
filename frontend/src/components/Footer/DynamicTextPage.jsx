import React from 'react';
import { useContent } from '../../context/useContent';
import './FooterPage.css';

const DynamicTextPage = ({ sectionKey, fallbackTitle }) => {
  const { getSectionContent, loading } = useContent();

  if (loading) {
    return (
      <div className="footer-page-wrapper">
        <div className="footer-page-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const title = getSectionContent(sectionKey, 'title', fallbackTitle);
  const subtitle = getSectionContent(sectionKey, 'subtitle', '');
  const bodyContent = getSectionContent(sectionKey, 'body_content', '');
  const contentBlocks = getSectionContent(sectionKey, 'content_blocks', []);

  // For multi-line text formatting
  const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {title && <h1>{title}</h1>}
        {subtitle && <h3 style={{ color: '#B8935B', marginBottom: '20px' }}>{subtitle}</h3>}
        {bodyContent && <p style={{ marginBottom: '40px' }}>{renderText(bodyContent)}</p>}

        {Array.isArray(contentBlocks) && contentBlocks.map((block, idx) => (
          <div key={idx} style={{ marginBottom: '30px' }}>
            {block.subheading && <h2>{block.subheading}</h2>}
            {block.text && <p>{renderText(block.text)}</p>}
          </div>
        ))}

        {!title && !bodyContent && (!contentBlocks || contentBlocks.length === 0) && (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Content is being updated.
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicTextPage;
