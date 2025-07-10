# GhostNote Flutter App - Complete Architecture

## Overview
A native Flutter app replicating the GhostNote web marketplace for digital notes with dark theme, modern UI, and comprehensive functionality for browsing, purchasing, creating, and managing premium notes.

## 📁 Project Structure

```
lib/
├── main.dart
├── app/
│   ├── app.dart                    # Main app widget with routing
│   ├── theme/
│   │   ├── app_theme.dart         # Dark theme configuration
│   │   ├── colors.dart            # GhostNote color palette
│   │   ├── text_styles.dart       # Typography system
│   │   └── dimensions.dart        # Spacing, sizes constants
│   └── constants/
│       ├── app_constants.dart     # App-wide constants
│       ├── routes.dart           # Route definitions
│       └── strings.dart          # Localization strings
├── core/
│   ├── config/
│   │   ├── supabase_config.dart  # Supabase initialization
│   │   └── env_config.dart       # Environment variables
│   ├── network/
│   │   ├── api_client.dart       # HTTP client wrapper
│   │   ├── network_info.dart     # Connectivity checker
│   │   └── api_endpoints.dart    # API endpoint constants
│   ├── storage/
│   │   ├── secure_storage.dart   # Encrypted local storage
│   │   ├── cache_manager.dart    # File/image caching
│   │   └── preferences.dart      # Shared preferences wrapper
│   ├── security/
│   │   ├── encryption_service.dart # Note content encryption
│   │   ├── clone_detector.dart   # Plagiarism detection
│   │   └── secure_reader.dart    # Anti-copy mechanisms
│   ├── utils/
│   │   ├── validators.dart       # Input validation
│   │   ├── formatters.dart       # Text/date formatters
│   │   ├── extensions.dart       # Dart extensions
│   │   └── logger.dart          # Logging utility
│   └── error/
│       ├── exceptions.dart       # Custom exceptions
│       ├── failures.dart        # Error handling
│       └── error_handler.dart    # Global error handling
├── data/
│   ├── datasources/
│   │   ├── remote/
│   │   │   ├── auth_remote_datasource.dart
│   │   │   ├── notes_remote_datasource.dart
│   │   │   ├── user_remote_datasource.dart
│   │   │   └── analytics_remote_datasource.dart
│   │   └── local/
│   │       ├── auth_local_datasource.dart
│   │       ├── notes_cache_datasource.dart
│   │       └── user_cache_datasource.dart
│   ├── models/
│   │   ├── user_model.dart       # User data model
│   │   ├── note_model.dart       # Note data model
│   │   ├── purchase_model.dart   # Purchase transaction model
│   │   ├── analytics_model.dart  # Stats/analytics model
│   │   └── auth_model.dart       # Authentication model
│   └── repositories/
│       ├── auth_repository_impl.dart
│       ├── notes_repository_impl.dart
│       ├── user_repository_impl.dart
│       └── analytics_repository_impl.dart
├── domain/
│   ├── entities/
│   │   ├── user.dart            # User business entity
│   │   ├── note.dart            # Note business entity
│   │   ├── purchase.dart        # Purchase business entity
│   │   └── analytics.dart       # Analytics business entity
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── notes_repository.dart
│   │   ├── user_repository.dart
│   │   └── analytics_repository.dart
│   └── usecases/
│       ├── auth/
│       │   ├── sign_in_usecase.dart
│       │   ├── sign_up_usecase.dart
│       │   ├── sign_out_usecase.dart
│       │   └── delete_account_usecase.dart
│       ├── notes/
│       │   ├── get_notes_usecase.dart
│       │   ├── search_notes_usecase.dart
│       │   ├── create_note_usecase.dart
│       │   ├── purchase_note_usecase.dart
│       │   └── detect_clone_usecase.dart
│       └── user/
│           ├── get_profile_usecase.dart
│           ├── update_profile_usecase.dart
│           └── get_analytics_usecase.dart
├── presentation/
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── notes_provider.dart
│   │   ├── user_provider.dart
│   │   ├── theme_provider.dart
│   │   └── connectivity_provider.dart
│   ├── pages/
│   │   ├── splash/
│   │   │   ├── splash_page.dart
│   │   │   └── widgets/
│   │   │       └── animated_logo.dart
│   │   ├── auth/
│   │   │   ├── auth_page.dart
│   │   │   ├── sign_in_page.dart
│   │   │   ├── sign_up_page.dart
│   │   │   ├── private_account_page.dart
│   │   │   └── widgets/
│   │   │       ├── auth_form.dart
│   │   │       ├── social_auth_buttons.dart
│   │   │       └── private_account_generator.dart
│   │   ├── explore/
│   │   │   ├── explore_page.dart
│   │   │   ├── search_page.dart
│   │   │   └── widgets/
│   │   │       ├── note_card.dart
│   │   │       ├── category_filter.dart
│   │   │       ├── search_bar.dart
│   │   │       └── trending_section.dart
│   │   ├── note_detail/
│   │   │   ├── note_detail_page.dart
│   │   │   ├── note_preview_page.dart
│   │   │   └── widgets/
│   │   │       ├── note_header.dart
│   │   │       ├── purchase_section.dart
│   │   │       ├── preview_content.dart
│   │   │       └── author_info.dart
│   │   ├── reader/
│   │   │   ├── reader_page.dart
│   │   │   ├── pdf_reader_page.dart
│   │   │   └── widgets/
│   │   │       ├── secure_text_viewer.dart
│   │   │       ├── reading_controls.dart
│   │   │       └── anti_copy_overlay.dart
│   │   ├── create/
│   │   │   ├── create_note_page.dart
│   │   │   ├── editor_page.dart
│   │   │   ├── publish_page.dart
│   │   │   └── widgets/
│   │   │       ├── rich_text_editor.dart
│   │   │       ├── formatting_toolbar.dart
│   │   │       ├── image_picker_widget.dart
│   │   │       ├── gif_picker_widget.dart
│   │   │       └── publish_form.dart
│   │   ├── dashboard/
│   │   │   ├── dashboard_page.dart
│   │   │   ├── analytics_page.dart
│   │   │   └── widgets/
│   │   │       ├── quick_stats.dart
│   │   │       ├── recent_sales.dart
│   │   │       ├── clone_alerts.dart
│   │   │       └── earnings_chart.dart
│   │   ├── profile/
│   │   │   ├── profile_page.dart
│   │   │   ├── edit_profile_page.dart
│   │   │   ├── settings_page.dart
│   │   │   └── widgets/
│   │   │       ├── profile_header.dart
│   │   │       ├── editable_field.dart
│   │   │       ├── danger_zone.dart
│   │   │       └── privacy_settings.dart
│   │   └── my_notes/
│   │       ├── my_notes_page.dart
│   │       ├── purchased_notes_page.dart
│   │       └── widgets/
│   │           ├── note_list_item.dart
│   │           └── filter_tabs.dart
│   ├── widgets/
│   │   ├── common/
│   │   │   ├── custom_app_bar.dart
│   │   │   ├── loading_widget.dart
│   │   │   ├── error_widget.dart
│   │   │   ├── empty_state.dart
│   │   │   ├── ghost_button.dart
│   │   │   ├── ghost_text_field.dart
│   │   │   ├── gradient_container.dart
│   │   │   └── blur_overlay.dart
│   │   ├── navigation/
│   │   │   ├── bottom_nav_bar.dart
│   │   │   ├── nav_item.dart
│   │   │   └── floating_create_button.dart
│   │   └── dialogs/
│   │       ├── purchase_dialog.dart
│   │       ├── delete_confirmation.dart
│   │       └── clone_alert_dialog.dart
│   └── routes/
│       ├── app_router.dart       # GoRouter configuration
│       ├── route_guards.dart     # Auth guards
│       └── transitions.dart      # Custom page transitions
└── generated/
    └── assets.dart              # Asset generation
```

## 🎯 Core Features & Responsibilities

### 1. **Explore Page** (`lib/presentation/pages/explore/`)
- **Purpose**: Browse and discover premium notes
- **Features**:
  - Grid/List view of available notes
  - Category filtering (Development, AI/ML, Design, etc.)
  - Search functionality with filters
  - Trending notes section
  - Price-based sorting
- **Key Widgets**: `NoteCard`, `CategoryFilter`, `SearchBar`, `TrendingSection`

### 2. **Note Detail Page** (`lib/presentation/pages/note_detail/`)
- **Purpose**: View note information and purchase
- **Features**:
  - Note preview (limited content)
  - Author information and ratings
  - Purchase button with pricing
  - Reviews and ratings display
  - "Why buy this note?" section
- **Key Widgets**: `NoteHeader`, `PurchaseSection`, `PreviewContent`, `AuthorInfo`

### 3. **Reader View** (`lib/presentation/pages/reader/`)
- **Purpose**: Secure reading of purchased notes
- **Features**:
  - Anti-copy mechanisms (disable text selection, screenshots)
  - Encrypted content delivery
  - PDF/Markdown rendering
  - Reading progress tracking
  - Bookmark functionality
- **Key Widgets**: `SecureTextViewer`, `ReadingControls`, `AntiCopyOverlay`

### 4. **Create Note Page** (`lib/presentation/pages/create/`)
- **Purpose**: Rich text editor for creating notes
- **Features**:
  - Flutter Quill rich text editor
  - Image/GIF insertion and management
  - Formatting toolbar (bold, italic, lists, etc.)
  - Auto-save functionality
  - Preview mode
  - Publishing workflow
- **Key Widgets**: `RichTextEditor`, `FormattingToolbar`, `ImagePickerWidget`, `GifPickerWidget`

### 5. **Dashboard Page** (`lib/presentation/pages/dashboard/`)
- **Purpose**: Analytics and sales overview
- **Features**:
  - Quick stats (total sales, views, earnings)
  - Recent sales transactions
  - Clone detection alerts
  - Earnings charts and graphs
  - Performance metrics
- **Key Widgets**: `QuickStats`, `RecentSales`, `CloneAlerts`, `EarningsChart`

### 6. **User Profile Page** (`lib/presentation/pages/profile/`)
- **Purpose**: Manage user account and settings
- **Features**:
  - Public profile information (editable)
  - Private account details
  - Account deletion option
  - Privacy settings
  - Profile picture management
- **Key Widgets**: `ProfileHeader`, `EditableField`, `DangerZone`, `PrivacySettings`

### 7. **Authentication Flow** (`lib/presentation/pages/auth/`)
- **Purpose**: Multi-method authentication
- **Features**:
  - Google Sign-In integration
  - Phone number authentication
  - Private/Anonymous account creation
  - Secure credential storage
  - Login persistence
- **Key Widgets**: `AuthForm`, `SocialAuthButtons`, `PrivateAccountGenerator`

## 🏗️ Architecture Patterns

### **Clean Architecture Implementation**
- **Presentation Layer**: UI components, state management
- **Domain Layer**: Business logic, entities, use cases
- **Data Layer**: Repositories, data sources, models

### **State Management: Riverpod**
```dart
// Provider examples
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>
final notesProvider = FutureProvider.family<List<Note>, NotesFilter>
final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfile>
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>
```

### **Navigation: GoRouter**
```dart
// Route structure
/splash
/auth
  /sign-in
  /sign-up
  /private
/home
  /explore
  /search
/note/:id
  /preview
  /reader
/create
  /editor
  /publish
/dashboard
  /analytics
/profile
  /edit
  /settings
/my-notes
  /purchased
```

## 📦 Required Packages

### **Core Dependencies**
```yaml
dependencies:
  # Framework
  flutter: sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.2.0
  
  # Navigation
  go_router: ^13.0.0
  
  # Backend
  supabase_flutter: ^2.0.0
  
  # Rich Text Editor
  flutter_quill: ^9.0.0
  
  # Security & Storage
  flutter_secure_storage: ^9.0.0
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI Components
  cached_network_image: ^3.3.0
  flutter_staggered_animations: ^1.1.1
  lottie: ^3.0.0
  shimmer: ^3.0.0
  
  # Media Handling
  image_picker: ^1.0.4
  file_picker: ^6.1.1
  flutter_pdfview: ^1.3.2
  flutter_markdown: ^0.6.18
  
  # Utilities
  connectivity_plus: ^5.0.1
  package_info_plus: ^4.2.0
  device_info_plus: ^9.1.0
  share_plus: ^7.2.1
  url_launcher: ^6.2.1
  
  # Development
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1

dev_dependencies:
  # Build Runners
  build_runner: ^2.4.7
  freezed: ^2.4.6
  json_serializable: ^6.7.1
  riverpod_generator: ^2.3.0
  
  # Testing
  flutter_test: sdk: flutter
  mockito: ^5.4.2
  
  # Code Quality
  flutter_lints: ^3.0.1
```

### **Specialized Packages**
```yaml
# Authentication
google_sign_in: ^6.1.5
firebase_auth: ^4.15.0

# Media & Files
video_player: ^2.8.1
chewie: ^1.7.4
flutter_cache_manager: ^3.3.1

# Charts & Analytics
fl_chart: ^0.65.0
syncfusion_flutter_charts: ^24.1.41

# Security
crypto: ^3.0.3
encrypt: ^5.0.1

# Performance
flutter_native_splash: ^2.3.6
flutter_launcher_icons: ^0.13.1
```

## 🔐 Security & Anti-Copy Mechanisms

### **Secure Note Delivery**
```dart
class SecureNoteReader {
  // Encrypted content storage
  // Watermarked content display
  // Screenshot prevention
  // Copy/paste blocking
  // Time-limited access tokens
}
```

### **Clone Detection System**
```dart
class CloneDetector {
  // Text similarity algorithms
  // Fingerprint comparison
  // Automated flagging system
  // Real-time monitoring
}
```

## 🎨 Design System

### **Color Palette** (matching web app)
```dart
class GhostColors {
  static const black = Color(0xFF0A0A0A);
  static const dark = Color(0xFF1A1A1A);
  static const gray = Color(0xFF2A2A2A);
  static const purple = Color(0xFF6B46C1);
  static const neon = Color(0xFF00FF41);
  static const cyan = Color(0xFF00FFFF);
  static const red = Color(0xFFFF073A);
}
```

### **Typography System**
```dart
class GhostTextStyles {
  static const headline1 = TextStyle(/* Large titles */);
  static const headline2 = TextStyle(/* Section headers */);
  static const bodyText1 = TextStyle(/* Primary content */);
  static const caption = TextStyle(/* Meta information */);
  // Responsive text scaling
}
```

### **Component Library**
- `GhostButton`: Gradient buttons with hover effects
- `GhostTextField`: Dark-themed input fields
- `GhostCard`: Note cards with glassmorphism
- `GradientContainer`: Background containers
- `BlurOverlay`: Modal overlays with backdrop blur

## 🗄️ Database Schema (Supabase)

### **Tables Structure**
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_private BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Notes table
notes (
  id UUID PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT, -- Encrypted
  preview_content TEXT,
  category TEXT,
  price DECIMAL,
  is_published BOOLEAN,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Purchases table
purchases (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  note_id UUID REFERENCES notes(id),
  amount DECIMAL,
  purchased_at TIMESTAMP
)

-- Analytics table
analytics (
  id UUID PRIMARY KEY,
  note_id UUID REFERENCES notes(id),
  event_type TEXT, -- view, purchase, clone_detected
  metadata JSONB,
  created_at TIMESTAMP
)
```

### **Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
-- Users can only see their own private data
-- Published notes are publicly readable
-- Purchases are only visible to buyer and seller
```

## 🚀 Development Workflow

### **Phase 1: Foundation** (Week 1-2)
1. Setup project structure and dependencies
2. Implement authentication flow
3. Create base UI components and theme
4. Setup Supabase integration

### **Phase 2: Core Features** (Week 3-4)
1. Implement explore page and note browsing
2. Build note detail and purchase flow
3. Create basic dashboard
4. Add user profile management

### **Phase 3: Advanced Features** (Week 5-6)
1. Implement rich text editor
2. Add secure reader with anti-copy
3. Build analytics and reporting
4. Implement clone detection

### **Phase 4: Polish & Testing** (Week 7-8)
1. Add animations and micro-interactions
2. Implement offline capabilities
3. Performance optimization
4. Comprehensive testing

## 🧪 Testing Strategy

### **Unit Tests**
- Repository implementations
- Use case business logic
- Utility functions
- State management logic

### **Widget Tests**
- Individual UI components
- Page-level interactions
- Form validation
- Navigation flows

### **Integration Tests**
- End-to-end user journeys
- API integration
- Authentication flows
- Purchase workflows

## 📱 Platform Considerations

### **iOS Specific**
- App Store compliance for in-app purchases
- iOS design guidelines adherence
- Privacy manifest requirements

### **Android Specific**
- Material Design 3 components
- Android-specific permissions
- Play Store policy compliance

### **Performance Optimization**
- Image caching and lazy loading
- Efficient list rendering
- Memory management
- Network request optimization

## 🔮 Future Enhancements

### **Advanced Features**
- AI-powered content recommendations
- Advanced analytics dashboard
- Multi-language support
- Dark/light theme switching
- Offline reading capabilities
- Social features (following, comments)
- Advanced search with filters
- Export functionality (PDF generation)

### **Monetization Features**
- Subscription tiers
- Creator revenue sharing
- Premium features
- Advertising integration

This architecture provides a scalable, maintainable foundation for building the GhostNote Flutter app with modern development practices and security considerations.
