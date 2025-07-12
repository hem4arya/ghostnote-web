# Transparency Feature

The transparency feature provides comprehensive clone detection and content originality analysis for the GhostNote platform. It ensures buyers have clear information about content authenticity while protecting original creators.

## 🎯 **Feature Overview**

This feature implements a complete transparency system including:

- **Clone Detection**: AI-powered content similarity analysis
- **Transparency Badges**: Visual indicators of content originality  
- **Creator Alerts**: Notification system for original creators
- **Buyer Protection**: Clear information before purchase
- **Warning System**: Pre-publication similarity checks

## 📁 **Feature Structure**

```
src/features/transparency/
├── components/
│   ├── CloneTransparencyBadge.tsx      # Main UI badge component
│   ├── CloneTransparencyWrapper.tsx     # Production wrapper
│   ├── CloneTransparencyWrapperDev.tsx  # Development wrapper with mock data
│   ├── CloneWarningModal.tsx           # Pre-publication warning modal
│   └── CloneAlerts.tsx                 # Creator notification dashboard
├── hooks/
│   └── useTransparencyData.ts          # React hook for transparency data
├── utils/
│   ├── transparencyApi.ts              # API calls to backend
│   ├── transparencyHelpers.ts          # Helper functions and utilities
│   └── mockData.ts                     # Mock data for development/testing
├── types/
│   └── index.ts                        # TypeScript type definitions
├── index.ts                            # Main feature exports
├── tsconfig.json                       # TypeScript configuration
├── transparency.code-workspace         # VSCode workspace
└── README.md                           # This file
```

## 🔧 **Development Workflow**

### **Isolated Development**
```bash
# Open the transparency workspace in VSCode
code src/features/transparency/transparency.code-workspace

# Start development server (from root project)
npm run dev

# Work in the transparency folder with full hot-reload support
```

### **Component Development**
```tsx
// Import components from the feature
import { 
  CloneTransparencyBadge, 
  CloneWarningModal,
  useTransparencyData 
} from '@/features/transparency';

// Use in your components
function MyComponent() {
  const { data, loading } = useTransparencyData(noteId);
  
  return (
    <CloneTransparencyBadge
      is_clone={data?.is_clone}
      originality_score={data?.originality_score}
      // ... other props
    />
  );
}
```

## 🎨 **Components**

### **CloneTransparencyBadge**
Main visual component that displays content originality information.

**Features:**
- Color-coded severity levels (green → yellow → orange → red)
- Originality percentage display
- Links to original sources (when public)
- Expandable detailed information
- Buyer recommendations

**Usage:**
```tsx
<CloneTransparencyBadge
  is_clone={true}
  originality_score={65}
  originality_level="Modified"
  similarity_score={35}
  original_note={originalNoteData}
  transparency_badge={badgeData}
  buyer_message={messageData}
  showDetailedInfo={true}
/>
```

### **CloneTransparencyWrapper**
Production wrapper that fetches real data from the backend.

**Features:**
- Calls Supabase Edge Functions
- Handles loading and error states
- Only renders badges for cloned content
- Caches transparency data

**Usage:**
```tsx
<CloneTransparencyWrapper
  noteId="123"
  userId="user-456"
  showDetailedInfo={true}
/>
```

### **CloneTransparencyWrapperDev**
Development version using mock data for testing.

**Features:**
- No backend dependency
- Simulated API delays
- Various test scenarios
- Perfect for component development

### **CloneWarningModal**
Pre-publication warning system for creators.

**Features:**
- Real-time similarity checking
- Warns before publishing similar content
- Shows links to similar existing notes
- Escalating warning levels

**Usage:**
```tsx
<CloneWarningModal
  userId={user.id}
  noteTitle={title}
  noteContent={content}
  onProceed={handlePublish}
  onCancel={handleCancel}
  isVisible={showModal}
/>
```

### **CloneAlerts**
Dashboard component for creators to manage clone notifications.

**Features:**
- Lists detected clones of user's content
- Side-by-side comparison
- Dismissible alerts
- Links to original and suspected clone

## 🔗 **Backend Integration**

### **Supabase Edge Functions**
```
supabase/functions/
├── note-transparency/          # Main transparency data API
├── check-clone-warning/        # Pre-publication similarity check
├── creator-clone-dashboard/    # Creator dashboard data
├── note-similarity/            # Similarity calculation engine
└── process-clone-detection/    # Background clone processing
```

### **API Endpoints**

**Get Transparency Data:**
```typescript
const { data, error } = await supabase.functions.invoke('note-transparency', {
  body: { note_id: noteId, user_id: userId }
});
```

**Check for Clone Warning:**
```typescript
const { data, error } = await supabase.functions.invoke('check-clone-warning', {
  body: { user_id: userId, note_title: title, note_content: content }
});
```

## 📊 **Originality Classification**

| **Level** | **Score Range** | **Badge Color** | **Description** |
|-----------|-----------------|-----------------|-----------------|
| **Original** | 90-100% | 🟢 Green | Created from scratch |
| **Modified** | 60-89% | 🟡 Yellow | Significant modifications |
| **Heavily Inspired** | 30-59% | 🟠 Orange | Heavy inspiration with changes |
| **Clone** | 0-29% | 🔴 Red | Minimal changes from original |

## 🛡️ **Privacy & Ethics**

### **Creator Privacy Protection**
- Original creators can choose public/private linking
- Anonymous similarity detection available
- Respectful messaging for all scenarios

### **Buyer Transparency**
- Clear originality information
- Educational rather than accusatory language
- Informed purchase decision support

### **Platform Integrity**
- Automated quality assurance
- Creator relationship protection
- Fair content valuation

## 🧪 **Testing & Development**

### **Mock Data Scenarios**
The feature includes comprehensive mock data for testing:

```typescript
// Available test scenarios
'1' // Original content (95% original)
'2' // Modified content (65% original, 35% similarity)
'3' // Heavily inspired (40% original, 60% similarity) 
'4' // Clone (15% original, 85% similarity)
'5' // Anonymous original creator
```

### **Development Mode**
```tsx
// Use development wrapper for testing
import { CloneTransparencyWrapperDev } from '@/features/transparency';

<CloneTransparencyWrapperDev 
  noteId="2" // Use mock scenario
  showDetailedInfo={true}
/>
```

## 🚀 **Usage Examples**

### **In Note Detail Pages**
```tsx
import { CloneTransparencyWrapper } from '@/features/transparency';

function NoteDetailPage({ noteId, userId }) {
  return (
    <div>
      <h1>Note Title</h1>
      <CloneTransparencyWrapper 
        noteId={noteId}
        userId={userId}
        showDetailedInfo={true}
        className="mt-4"
      />
      <div>Note content...</div>
    </div>
  );
}
```

### **In Note Creation Flow**
```tsx
import { CloneWarningModal } from '@/features/transparency';

function CreateNoteForm() {
  const [showWarning, setShowWarning] = useState(false);
  
  const handleSubmit = () => {
    setShowWarning(true); // Check for similarity before publishing
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
      
      <CloneWarningModal
        userId={user.id}
        noteTitle={title}
        noteContent={content}
        onProceed={publishNote}
        onCancel={() => setShowWarning(false)}
        isVisible={showWarning}
      />
    </>
  );
}
```

### **In Creator Dashboard**
```tsx
import { CloneAlerts } from '@/features/transparency';

function CreatorDashboard({ userId }) {
  return (
    <div>
      <h1>Your Dashboard</h1>
      <CloneAlerts userId={userId} />
    </div>
  );
}
```

## 🔧 **Customization**

### **Styling**
All components use Tailwind CSS and can be customized via className props:

```tsx
<CloneTransparencyBadge
  className="custom-badge-styles"
  // ... other props
/>
```

### **Threshold Configuration**
Originality thresholds can be adjusted in `transparencyHelpers.ts`:

```typescript
export function getOriginalityLevel(score: number) {
  if (score >= 90) return 'Original';
  if (score >= 60) return 'Modified';
  if (score >= 30) return 'Heavily Inspired';
  return 'Clone';
}
```

## 📈 **Performance Considerations**

### **Caching**
- Transparency data is cached for 5 minutes
- Reduces redundant API calls
- Improves user experience

### **Conditional Rendering**
- Badges only render for cloned content
- Original content shows minimal UI
- Reduces visual noise

### **Lazy Loading**
- Transparency data loads on demand
- Doesn't block initial page render
- Graceful error handling

## 🔍 **Troubleshooting**

### **Common Issues**

**Import Errors:**
```bash
# Ensure you're importing from the feature index
import { CloneTransparencyBadge } from '@/features/transparency';
# Not from individual files
```

**Missing Data:**
```bash
# Check that the backend functions are deployed
supabase functions deploy note-transparency
```

**Development Setup:**
```bash
# Use the dev wrapper for testing without backend
import { CloneTransparencyWrapperDev } from '@/features/transparency';
```

## 🎯 **Future Enhancements**

- [ ] Real-time collaboration detection
- [ ] Multi-language content analysis  
- [ ] Advanced similarity algorithms
- [ ] Creator verification system
- [ ] Automated mediation tools

This transparency feature provides a complete foundation for content authenticity and creator protection in the GhostNote platform.
