/**
 * Footer Component - Homepage footer with theme system integration
 * Features glassmorphism background and responsive design
 */

'use client';

import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`homepage-footer ${className}`}>
      <div className="homepage-footer-container">
        <p className="homepage-footer-copyright">
          &copy; {currentYear}{' '}
          <span className="homepage-footer-brand">GhostNote</span>
          . All rights reserved.
        </p>
        <p className="homepage-footer-tagline">
          A marketplace for the modern learner in the digital underground.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
