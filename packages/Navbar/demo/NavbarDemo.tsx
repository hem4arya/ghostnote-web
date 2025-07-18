import { HelpCircle, Settings, Star } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../index";
import { Button } from "../src/components/ui/Button";
import { User } from "../src/types";

/**
 * Demo component showing the Navbar in action
 * This demonstrates all the key features and customization options
 */
export function NavbarDemo() {
  const [user, setUser] = useState<User | null>(null);

  // Mock user for testing
  const mockUser: User = {
    id: "demo-user",
    name: "Jane Smith",
    email: "jane@ghostnote.com",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const handleLogin = () => {
    console.log("Demo: Login clicked");
    // Simulate login
    setUser(mockUser);
  };

  const handleSignUp = () => {
    console.log("Demo: SignUp clicked");
    window.alert("Demo: Would redirect to signup page");
  };

  return (
    <div className="min-h-screen bg-ghost-black">
      {/* Basic Navbar */}
      <section>
        <h2 className="text-2xl font-bold text-white p-6 bg-ghost-dark border-b border-ghost-purple/20">
          Basic Navbar (No User)
        </h2>
        <Navbar onLoginClick={handleLogin} onSignUpClick={handleSignUp} />
      </section>

      <div className="h-8"></div>

      {/* Navbar with User */}
      <section>
        <h2 className="text-2xl font-bold text-white p-6 bg-ghost-dark border-b border-ghost-purple/20">
          Navbar with User
        </h2>
        <Navbar
          user={user}
          onLoginClick={handleLogin}
          onSignUpClick={handleSignUp}
        />
      </section>

      <div className="h-8"></div>

      {/* Customized Navbar */}
      <section>
        <h2 className="text-2xl font-bold text-white p-6 bg-ghost-dark border-b border-ghost-purple/20">
          Fully Customized Navbar
        </h2>
        <Navbar
          user={user}
          onLoginClick={handleLogin}
          onSignUpClick={handleSignUp}
          overrides={{
            logo: (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DemoApp
                </span>
              </div>
            ),
            searchPlaceholder: "Search demo content...",
            menuItems: [
              {
                label: "Premium Features",
                href: "#premium",
                icon: <Star className="h-4 w-4" />,
              },
              {
                label: "Help Center",
                href: "#help",
                icon: <HelpCircle className="h-4 w-4" />,
              },
              {
                label: "Custom Action",
                onClick: () => alert("Custom action clicked!"),
                icon: <Settings className="h-4 w-4" />,
              },
            ],
            rightButtons: (
              <Button variant="neon" size="sm">
                Demo Button
              </Button>
            ),
            className: "border-b-2 border-cyan-500/30",
          }}
        />
      </section>

      {/* Demo Controls */}
      <div className="p-8 bg-ghost-dark/50">
        <h3 className="text-xl font-bold text-white mb-4">Demo Controls</h3>
        <div className="flex space-x-4">
          <Button
            variant={user ? "secondary" : "default"}
            onClick={() => setUser(user ? null : mockUser)}
          >
            {user ? "Logout Demo User" : "Login Demo User"}
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Demo
          </Button>
        </div>

        <div className="mt-6 p-4 bg-ghost-gray/30 rounded-lg">
          <h4 className="text-sm font-semibold text-ghost-neon mb-2">
            Features Demonstrated:
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>
              ✅ Beautiful cyber-themed design with gradients and glow effects
            </li>
            <li>✅ Responsive mobile-first layout</li>
            <li>✅ User authentication states (logged in/out)</li>
            <li>✅ Functional login/signup popup modal</li>
            <li>✅ Search functionality with live input</li>
            <li>✅ Custom logo and branding</li>
            <li>✅ Extensible menu items with icons</li>
            <li>✅ Additional right-side buttons</li>
            <li>✅ Smooth hover and focus animations</li>
            <li>✅ Mobile menu overlay</li>
            <li>✅ TypeScript support with full type safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavbarDemo;
