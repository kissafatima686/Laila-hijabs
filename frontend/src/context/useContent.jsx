import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all dynamic sections from the backend API
    fetch('http://localhost:5000/api/sections')
      .then((res) => res.json())
      .then((data) => {
        // Convert array of sections into a key-value dictionary for fast lookups
        const map = {};
        if (Array.isArray(data)) {
          data.forEach((item) => {
            let meta = {};
            try {
              meta = item.metadata ? (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata) : {};
            } catch (e) {
              console.error(`Failed to parse metadata for section ${item.section_key}`);
            }
            map[item.section_key] = {
              title: item.title,
              subtitle: item.subtitle,
              body_content: item.body_content,
              image_url: item.image_url,
              image_url_2: item.image_url_2,
              button_text: item.button_text,
              button_link: item.button_link,
              badge_text: item.badge_text,
              ...meta
            };
          });
        }
        setSections(map);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dynamic site content', err);
        setLoading(false);
      });
  }, []);

  // Helper to grab text or image dynamically: getSectionContent('home_hero', 'title', 'Default Title')
  // Returns fallback if the section, the field, or the disabled state is triggered.
  const getSectionContent = (sectionKey, fieldKey, fallback = '') => {
    if (!sections[sectionKey]) return fallback;
    const val = sections[sectionKey][fieldKey];
    if (typeof val === 'string' && val.startsWith('[DISABLED]')) return null;
    return val !== undefined && val !== null && val !== '' ? val : fallback;
  };

  return (
    <ContentContext.Provider value={{ getSectionContent, sections, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
