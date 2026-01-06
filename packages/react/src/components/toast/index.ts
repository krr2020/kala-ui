import { toast as sonnerToast } from 'sonner';

/**
 * Custom toast wrapper with proper variant styling
 */
const toast = {
  success: (message: string) => {
    return sonnerToast.success(message);
  },
  error: (message: string) => {
    return sonnerToast.error(message);
  },
  warning: (message: string) => {
    return sonnerToast.warning(message);
  },
  info: (message: string) => {
    return sonnerToast.info(message);
  },
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },
};

export { toast };
export { Toaster } from './toaster';
