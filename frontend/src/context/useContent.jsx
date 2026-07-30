import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSections = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/sections')
      .then((res) => res.json())
      .then((data) => {
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
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Helper to grab text or image dynamically: getSectionContent('home_hero', 'title', 'Default Title')
  // Returns null if deactivated/disabled so element is hidden from frontend!
  const getSectionContent = (sectionKey, fieldKey, fallback = '') => {
    if (!sections[sectionKey]) return fallback;
    const sec = sections[sectionKey];

    // Check explicitly saved field statuses
    const fieldStatuses = sec.field_statuses || {};
    if (fieldStatuses[fieldKey] === 'Inactive' || fieldStatuses[fieldKey] === 'Draft' || fieldStatuses[fieldKey] === 'Disabled') {
      return null;
    }

    const val = sec[fieldKey];
    if (typeof val === 'string' && (val === '[DISABLED]' || val.startsWith('[DISABLED]'))) {
      return null;
    }

    return val !== undefined && val !== null ? val : fallback;
  };

  return (
    <ContentContext.Provider value={{ getSectionContent, sections, loading, refetchContent: fetchSections }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
