import React, { useState, useEffect } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderIcon = (index) => {
    return (
      <svg
        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium"
        focusable="false"
        width="30px"
        height="30px"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid={
          activeIndex === index
            ? 'KeyboardArrowDownIcon'
            : 'KeyboardArrowUpIcon'
        }
        style={{
          transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s'
        }}
      >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
      </svg>
    );
  };

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggleAccordion(index)}
          >
            {faq.question}
            {renderIcon(index)}
          </button>
          {activeIndex === index && (
            <div className="faq-answer">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const faqs = [
  {
    question: 'How do I create an account?',
    answer:
      "Simply click on the 'Sign Up' button located at the top-right corner of the homepage. Follow the prompts to enter your details and create your account."
  },
  {
    question: 'How can I place an order?',
    answer:
      "Placing an order is easy! Once you've found the product you want to buy, click on it to view details and then click on the 'Buy Now' or 'Add to Cart' button. Follow the steps to complete your order."
  },
  {
    question: 'What payment options are available?',
    answer:
      'Flipkart offers various payment options including credit/debit cards, net banking, UPI, EMI, and Cash on Delivery (COD) for eligible orders.'
  },
  {
    question: 'How can I track my order?',
    answer:
      "You can track your order by clicking on the 'Track Order' link in the 'My Orders' section of your account. You will receive regular updates on your order status via email and SMS."
  },
  {
    question: 'How do I update my account information?',
    answer:
      "To update your account information, log in to your account, go to the 'Profile' section, and make the necessary changes. Don't forget to save your updates."
  },
  {
    question: 'What is ONDC and how does it work?',
    answer:
      'ONDC (Open Network for Digital Commerce) is a government initiative to promote open networks developed on open-sourced methodology, using open specifications and open network protocols, independent of any specific platform.'
  },
  {
    question: 'What support options are available?',
    answer:
      'We offer various support options including a help center, email support, and live chat. You can also contact our support team through the "Contact Us" section on our website.'
  },
  {
    question: 'What are the benefits of using your platform for businesses?',
    answer:
      'Our platform provides businesses with a wide reach, seamless integration with digital commerce services, access to accurate location data via OpenStreetMap, and various tools to enhance your digital presence and operations.'
  }
];

export default FAQ;