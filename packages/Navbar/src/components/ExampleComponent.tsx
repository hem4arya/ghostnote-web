import React from 'react';

interface ExampleComponentProps {
  title?: string;
  children?: React.ReactNode;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ 
  title = 'Example Component',
  children 
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default ExampleComponent;
