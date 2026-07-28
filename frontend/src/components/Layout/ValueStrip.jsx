import React from 'react';
import { useContent } from '../../context/useContent';
import './ValueStrip.css';

const ValueStrip = () => {
  const { getSectionContent } = useContent();
  const rawItems = getSectionContent('home_value_strip', 'items', []);
  
  const defaultItems = [
    { title: "EASY RETURNS", text: "Shop with confidence & enjoy easy returns. Exchanges are free." },
    { title: "SIZE & LENGTH OPTIONS", text: "We offer dresses in size and lengths." },
    { title: "DESIGNED IN LONDON SINCE 2009", text: "Female-led independent womenswear brand, prioritising small-batch production." }
  ];

  // Map the CMS data which might have 'title' and 'subtitle' instead of 'text'
  const items = (Array.isArray(rawItems) && rawItems.length > 0) 
    ? rawItems.map(item => ({ title: item.title, text: item.subtitle || item.text })) 
    : defaultItems;

  return (
    <section className="value-strip">
      {items.map((item, index) => (
        <div key={index} className="strip-item">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
};

export default ValueStrip;