// Comprehensive navbar import test
import Navbar from '@/components/navbar';
import { 
  MobileMenu, 
  UserDropdown, 
  NavbarSearch, 
  NavigationButtons,
  useNavbar,
  getNavStyles,
  type NavbarProps,
  type User
} from '@/components/navbar';

// Test that all exports are working - log them to avoid unused variable warnings
console.log('Testing navbar exports:', {
  Navbar,
  MobileMenu,
  UserDropdown,
  NavbarSearch,
  NavigationButtons,
  useNavbar,
  getNavStyles
});

// Test types
const testUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

const testProps: NavbarProps = {
  onLoginClick: () => {},
  onSignUpClick: () => {},
  user: testUser,
  isAuthenticated: true
};

// Use testProps to avoid unused warning
console.log('Test props configured:', testProps);

console.log('All navbar exports working correctly!');

export default function NavbarImportTest() {
  return (
    <div>
      <h1>Navbar Import Test</h1>
      <p>All navbar components and utilities imported successfully!</p>
    </div>
  );
}
