export default function LocalFooter() {
  return (
    <footer className="bg-ghost-dark border-t border-ghost-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-ghost-purple to-ghost-neon rounded-lg"></div>
              <span className="text-xl font-bold text-ghost-white">
                GhostNote
              </span>
            </div>
            <p className="text-ghost-light mb-4">
              Capture, organize, and share your thoughts with the power of
              modern note-taking.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-ghost-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-ghost-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-ghost-light hover:text-ghost-white transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ghost-muted/20 mt-8 pt-8 text-center">
          <p className="text-ghost-light">
            © 2024 GhostNote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
