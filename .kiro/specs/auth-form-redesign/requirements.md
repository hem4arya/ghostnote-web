# Requirements Document

## Introduction

This feature focuses on redesigning the authentication form system to provide distinct user experiences for sign-in and sign-up flows, improve the private account creation interface, and enhance visual consistency and usability. The current implementation uses a shared form for both sign-in and sign-up, which causes confusion and breaks standard UX expectations.
This redesign also includes refined theming, security considerations, and accessibility support.

## Requirements

### Requirement 1

**User Story:** As a new user, I want a dedicated sign-up form with proper validation, so that I can create an account with confidence and clear feedback.

#### Acceptance Criteria

1. WHEN a user selects sign-up THEN the system SHALL display a form with email, password, and confirm password fields
2. WHEN a user enters passwords in both password fields THEN the system SHALL validate that both passwords match in real-time
3. WHEN passwords don't match THEN the system SHALL display a clear validation error message
4. WHEN a user clicks the eye icon on password fields THEN the system SHALL toggle password visibility for that specific field
5. WHEN a user submits the sign-up form with valid data THEN the system SHALL create a new account and provide success feedback

### Requirement 2

**User Story:** As a returning user, I want a streamlined sign-in form, so that I can quickly access my account without unnecessary fields.

#### Acceptance Criteria

1. WHEN a user selects sign-in THEN the system SHALL display a form with only email and password fields
2. WHEN a user enters their credentials THEN the system SHALL validate the input format before submission
3. WHEN a user clicks the eye icon on the password field THEN the system SHALL toggle password visibility
4. WHEN a user submits valid credentials THEN the system SHALL authenticate and redirect them to the dashboard
5. WHEN authentication fails THEN the system SHALL display a clear error message

### Requirement 3

**User Story:** As a user, I want intuitive navigation between sign-in and sign-up modes, so that I can easily switch between them without confusion.

#### Acceptance Criteria

1. WHEN a user is on the sign-in form THEN the system SHALL display a link saying "Don't have an account? Sign up"
2. WHEN a user is on the sign-up form THEN the system SHALL display a link saying "Already have an account? Sign in"
3. WHEN a user clicks the toggle link THEN the system SHALL switch to the appropriate form mode
4. WHEN switching between modes THEN the system SHALL clear any existing form data and error messages
5. WHEN switching between modes THEN the system SHALL update the dialog title and description appropriately

### Requirement 4

**User Story:** As a privacy-conscious user, I want an improved private account creation interface, so that I can easily create an anonymous account with proper visual cues.

#### Acceptance Criteria

1. WHEN viewing authentication options THEN the system SHALL display a private account option with a distinctive icon
2. WHEN a user clicks the private account option THEN the system SHALL open a dedicated private account setup dialog
3. WHEN in private account setup THEN the system SHALL display password-only fields (email optional) with proper validation
4. WHEN creating a private account THEN the system SHALL auto-generate a word-word handle and display it to the user
5. WHEN a password is lost THEN the system SHALL warn that the account will be permanently deleted in 60 days
6. WHEN private account creation is successful THEN the system SHALL close the dialog and authenticate the user

### Requirement 5

**User Story:** As a user, I want consistent and recognizable social login options, so that I can easily identify and use my preferred authentication method.

#### Acceptance Criteria

1. WHEN viewing social login options THEN the system SHALL display GitHub and Google icons that follow official branding guidelines
2. WHEN viewing the Google login option THEN the system SHALL use the official Google icon (not Chrome)
3. WHEN viewing the private account option THEN the system SHALL display it alongside social login buttons
4. WHEN hovering over social login buttons THEN the system SHALL provide visual hover feedback
5. WHEN clicking social login buttons THEN the system SHALL initiate the correct OAuth flow
6. WHEN OAuth fails THEN the system SHALL display an error message and fallback to standard login

### Requirement 6

**User Story:** As a user, I want clear visual feedback and validation, so that I understand the status of my form inputs and any errors that occur.

#### Acceptance Criteria

1. WHEN a user interacts with form fields THEN the system SHALL provide real-time validation feedback
2. WHEN form validation fails THEN the system SHALL display specific error messages for each field
3. WHEN passwords don't match THEN the system SHALL highlight both password fields and show a clear error message
4. WHEN form submission is in progress THEN the system SHALL disable the submit button and show loading state
5. WHEN form submission completes THEN the system SHALL provide appropriate success or error feedback

### Requirement 7

**User Story:** As a user, I want a visually consistent and branded experience, so that the authentication forms match the rest of the site.

#### Acceptance Criteria

1. WHEN viewing the authentication interface THEN the system SHALL use a green and purple theme that matches the site's global styles
2. WHEN implementing colors THEN the system SHALL define exact HEX values in shared CSS variables for reuse across the site
3. WHEN applying primary styling THEN the system SHALL use the green color for action buttons, success states, and highlights
4. WHEN applying secondary styling THEN the system SHALL use the purple color for backgrounds, form headers, and accents
5. WHEN implementing styling changes THEN the system SHALL use shared CSS files to maintain consistency across the site

### Requirement 8

**User Story:** As a user, I want the authentication system to work seamlessly on all devices and for all accessibility needs.

#### Acceptance Criteria

1. WHEN accessing the system on different devices THEN the system SHALL be fully responsive on mobile, tablet, and desktop
2. WHEN navigating with keyboard THEN all interactive elements SHALL be keyboard-accessible
3. WHEN using assistive technology THEN all form fields and buttons SHALL include descriptive ARIA labels
4. WHEN errors occur THEN error messages SHALL be readable by screen readers
5. WHEN viewing the interface THEN contrast ratios SHALL meet WCAG AA accessibility standards

### Requirement 9

**User Story:** As a security-conscious user, I want my account protected from brute-force and spam attacks through proper Supabase integration.

#### Acceptance Criteria

1. WHEN implementing authentication THEN the system SHALL use Supabase client configured with environment variables from env.local
2. WHEN connecting to the database THEN the system SHALL reference the codebase configuration for SUPABASE_URL and SUPABASE_ANON_KEY
3. WHEN users attempt failed logins THEN the system SHALL leverage Supabase's built-in rate limiting to prevent brute-force attacks
4. WHEN users create email-based accounts THEN the system SHALL use Supabase's email verification flow before granting full access
5. WHEN handling authentication THEN the system SHALL rely on Supabase's secure password hashing and storage
6. WHEN transmitting data THEN all authentication traffic SHALL be sent over HTTPS through Supabase's secure endpoints