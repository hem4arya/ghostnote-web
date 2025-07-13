// Main component exports - only exporting files with actual content
// Layout Components
export { default as Navbar } from '../../shell/src/Navbar';
export { default as Footer } from '../../shell/src/Footer';

// Dashboard Components
export { default as DashboardTabs } from './DashboardTabs';
export { default as QuickStats } from '../../dashboard/src/components/QuickStats';
export { CreatorCloneDashboard } from './CreatorCloneDashboard';

// Search Components
export { default as SmartSearchDropdown } from '../../search/components/SmartSearchDropdown';

// UI Components
export { default as Alerts } from './Alerts';
export * from '../../note-reader/src/components/NoteReaderUI';
export { default as TransparencyUI } from './TransparencyUI';