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

// Test that all exports are working
const testNavbar = Navbar;
const testMobileMenu = MobileMenu;
const testUserDropdown = UserDropdown;
const testNavbarSearch = NavbarSearch;
const testNavigationButtons = NavigationButtons;
const testUseNavbar = useNavbar;
const testGetNavStyles = getNavStyles;

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

console.log('All navbar exports working correctly!');

export default function NavbarImportTest() {
  return (
    <div>
      <h1>Navbar Import Test</h1>
      <p>All navbar components and utilities imported successfully!</p>
    </div>
  );
}
