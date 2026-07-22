import React, { useState } from 'react';
import './FAQ.css';
import './FooterPage.css';
import { FaChevronDown } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question} <FaChevronDown />
      </button>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { question: "WHAT ARE GIFT CARDS, AND HOW DO THEY WORK?", answer: "Gift cards are digital codes..." },
    { question: "CAN I SEND A GIFT CARD DIRECTLY TO SOMEONE ELSE?", answer: "Yes, you can enter their email at checkout..." },
    { question: "CAN GIFT CARDS BE REFUNDED?", answer: "Unfortunately, gift cards are non-refundable." },
    // Add all your other questions here
  ];

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>GIFT CARDS & CREDIT NOTES</h1>
        <div className="faq-container">
          {faqs.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;