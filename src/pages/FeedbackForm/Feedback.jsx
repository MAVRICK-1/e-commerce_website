import React, { useEffect, useState } from 'react';
import './feedback.css';


function FeedbackPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [rating, setRating] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getEmojis = () => {
    switch (rating) {
      case 1:
        return '😡 😶 😶 😶 😶';
      case 2:
        return '😒 😒 😶 😶 😶';
      case 3:
        return '😐 😐 😐 😶 😶';
      case 4:
        return '😊 😊 😊 😊 😶';
      case 5:
        return '😁 😁 😁 😁 😁';
      default:
        return '😶 😶 😶 😶 😶';
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call or form submission delay (remove in actual implementation)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated success
    setSubmitting(false);

    alert('Your feedback has been submitted successfully!');

    // Reset form fields
    setRating(null);
    setName('');
    setEmail('');
    setFeedback('');
  };

  return (
    <div className="feedback-container">
      <div className="feedback-form">
        <h2>Your Feedback Matters!</h2>
        <p> Help Us Improve Your Experience.</p>
        <div>
          <label htmlFor="rating">Rate Your Experience:</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value)}
                className={rating === value ? 'selected' : ''}
              >
                {getEmojis().split(' ')[value - 1]}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="feedback">Feedback</label>
            <textarea
              id="feedback"
              rows="5"
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Share your thoughts with us..."
              required
              className="form-control"
            ></textarea>
          </div>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default FeedbackPage;
