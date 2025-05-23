import { useEffect } from 'react';
import useFormDataStore from '@/store';

export const useHydration = () => {
  const hydrate = useFormDataStore(state => state.hydrate);
  const isHydrated = useFormDataStore(state => state.isHydrated);
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  
  return isHydrated;
}; 