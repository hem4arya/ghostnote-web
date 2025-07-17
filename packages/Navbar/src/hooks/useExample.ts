import { useState, useEffect } from 'react';

interface UseExampleReturn {
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
}

const useExample = (initialValue: string = ''): UseExampleReturn => {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Example side effect
    console.log('Value changed:', value);
  }, [value]);

  return {
    value,
    setValue,
    isLoading
  };
};

export default useExample;
