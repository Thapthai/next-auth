'use client';

import { useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = useCallback((options: ToastOptions) => {
    // Dispatch custom event for toast
    const event = new CustomEvent('show-toast', { detail: options });
    window.dispatchEvent(event);
  }, []);

  return { toast };
}