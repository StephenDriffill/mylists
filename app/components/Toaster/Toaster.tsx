import * as React from 'react';
import { Toaster as SonnerToaster, toast as showToast } from 'sonner';

import type { Toast } from '~/models/toast.server';

interface ToasterProps {
  toast: Toast | null;
}

export default function Toaster({ toast }: ToasterProps) {
  React.useEffect(() => {
    if (toast !== null) {
      const { description, id, title, type } = toast;
      const duration = type === 'error' ? 8_000 : 4_000;
      showToast[type](title, { id, description, duration });
    }
  }, [toast]);

  return <SonnerToaster closeButton richColors />;
}
