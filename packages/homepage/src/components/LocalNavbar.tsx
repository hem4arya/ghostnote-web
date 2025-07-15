"use client";

interface LocalNavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export default function LocalNavbar({
  onLoginClick,
  onSignUpClick,
}: LocalNavbarProps) {
  return (
    <nav className="navbar sticky top-0 z-50 bg-ghost-black/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-ghost-purple to-ghost-neon rounded-lg pulse-glow"></div>
            <span className="text-xl font-bold gradient-text">GhostNote</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 fade-in fade-in-delay-1">
            <a href="#features" className="navbar-link">
              Features
            </a>
            <a href="#about" className="navbar-link">
              About
            </a>
            <a href="#contact" className="navbar-link">
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4 fade-in fade-in-delay-2">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-ghost-light hover:text-ghost-white transition-colors navbar-link"
            >
              Log In
            </button>
            <button onClick={onSignUpClick} className="btn-primary">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
