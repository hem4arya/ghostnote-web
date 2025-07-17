// Export all types from this package
export interface ExampleType {
  id: string;
  name: string;
  createdAt: Date;
}

export type ExampleStatus = 'pending' | 'active' | 'inactive';
