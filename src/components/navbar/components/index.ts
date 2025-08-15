// Navbar components barrel export
export { default as MobileMenu } from './MobileMenu';
export { UserDropdown } from './UserDropdown';
export { default as NavbarSearch } from './NavbarSearch';
export { NavigationButtons } from './NavigationButtons';
export { AuthButton } from './AuthButton';
// PrivateAccountSetup removed - using PrivateAccountForm with AuthDialog instead
// export {getSupabaseClient} from '../../../lib/supabase'
// Authentication components
export { default as AuthForm } from './AuthForm';
export { SignInForm } from './SignInForm';
export { SignUpForm } from './SignUpForm';
export { SocialAuthButtons } from './SocialAuthButtons';
export { FormToggle } from './FormToggle';
export { AuthDialog } from './AuthDialog';