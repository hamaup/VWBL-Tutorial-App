import { useCallback } from 'react';

export const useGetElementProperty = (elementRef) => {
  const getElementProperty = useCallback(
    (targetProperty) => {
      const clientRect = elementRef.current?.getBoundingClientRect();
      if (clientRect) {
        return clientRect[targetProperty];
      }
      return 0;
    },
    [elementRef],
  );

  return {
    getElementProperty,
  };
};