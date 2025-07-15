interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

export const localSampleNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to GhostNote",
    content:
      "GhostNote is a powerful note-taking application designed for modern workflows. With features like real-time collaboration, advanced search, and intuitive organization, it helps you capture and organize your thoughts effortlessly.",
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["welcome", "getting-started"],
  },
  {
    id: "2",
    title: "Project Planning Template",
    content:
      "Use this template to structure your project planning sessions. Define clear objectives, break down tasks into manageable chunks, and set realistic timelines for successful project execution.",
    createdAt: "2024-01-14T15:45:00Z",
    tags: ["template", "planning"],
  },
  {
    id: "3",
    title: "Meeting Notes - Q1 Strategy",
    content:
      "Key points from today's strategy meeting: Focus on user experience improvements, expand mobile capabilities, and strengthen security features. Action items assigned to respective teams.",
    createdAt: "2024-01-13T09:15:00Z",
    tags: ["meeting", "strategy"],
  },
  {
    id: "4",
    title: "Reading List",
    content:
      "Books to read this quarter: 'The Design of Everyday Things' by Don Norman, 'Atomic Habits' by James Clear, 'Deep Work' by Cal Newport. Focus on design principles and productivity.",
    createdAt: "2024-01-12T14:20:00Z",
    tags: ["reading", "books"],
  },
  {
    id: "5",
    title: "Recipe: Perfect Coffee",
    content:
      "My perfected coffee brewing method: Use a 1:15 ratio of coffee to water, grind beans just before brewing, water temperature at 195°F, and brew for exactly 4 minutes. Enjoy!",
    createdAt: "2024-01-11T08:00:00Z",
    tags: ["recipe", "coffee"],
  },
  {
    id: "6",
    title: "Workout Routine",
    content:
      "Weekly fitness plan: Monday - Upper body strength, Tuesday - Cardio and flexibility, Wednesday - Lower body strength, Thursday - Active recovery, Friday - Full body circuit, Weekend - Outdoor activities.",
    createdAt: "2024-01-10T07:30:00Z",
    tags: ["fitness", "health"],
  },
];
