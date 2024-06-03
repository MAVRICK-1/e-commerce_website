import React from 'react';
import './privacypolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <section>
        <p>Last updated: May 30, 2024</p>
        <p>
          Welcome to Nest Mart & Grocery, your ultimate destination for all your
          shopping needs.{' '}
        </p>
      </section>
      <section>
        <h2>Information We Collect</h2>
        <p>
          We collect personal information that you provide to us, such as name,
          address, contact information, and payment information. We collect
          personal information when you register for our services, express an
          interest in obtaining information about us or our products and
          services, participate in activities on the Services, or otherwise
          contact us.
        </p>
      </section>
      <section>
        <h2>How We Use Your Information</h2>
        <p>
          We use personal information collected via our Services for a variety
          of business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests, in order to enter into or perform a contract with you, with
          your consent, and/or for compliance with our legal obligations.
        </p>
      </section>
      <section>
        <h2>Sharing Your Information</h2>
        <p>We may process or share data based on the following legal basis:</p>
        <ul>
          <li>
            <strong>Consent:</strong> We may process your data if you have given
            us specific consent to use your personal information for a specific
            purpose.
          </li>
          <li>
            <strong>Legitimate Interests:</strong> We may process your data when
            it is reasonably necessary to achieve our legitimate business
            interests.
          </li>
          <li>
            <strong>Performance of a Contract:</strong> Where we have entered
            into a contract with you, we may process your personal information
            to fulfill the terms of our contract.
          </li>
          <li>
            <strong>Legal Obligations:</strong> We may disclose your information
            where we are legally required to do so in order to comply with
            applicable law, governmental requests, a judicial proceeding, court
            order, or legal process, such as in response to a court order or a
            subpoena (including in response to public authorities to meet
            national security or law enforcement requirements).
          </li>
        </ul>
      </section>
      <section>
        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable, and no method of data transmission can be guaranteed
          against any interception or other type of misuse.
        </p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this policy, you may email us
          at:{' '}
          <a href="mailto:nestmartandgrocery@example.com">
            nestmartandgrocery@support.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
