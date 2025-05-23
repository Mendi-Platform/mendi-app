"use client";

import { useEffect } from 'react';
import useFormDataStore from '@/store';

export default function ClientHydration() {
  const hydrate = useFormDataStore(state => state.hydrate);
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  
  return null;
} 