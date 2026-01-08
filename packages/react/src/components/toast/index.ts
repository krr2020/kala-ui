import { toast as sonnerToast } from "sonner";

type ToastOptions = Parameters<typeof sonnerToast>[1];

/**
 * Toast API that supports all Sonner options including custom icons
 * 
 * @example Basic usage
 * toast.success('Success message');
 * 
 * @example With custom icon
 * toast.success('Success message', { icon: <CustomIcon /> });
 * 
 * @example Remove icon
 * toast.success('Success message', { icon: null });
 * 
 * @example Full options
 * toast.success('Success message', {
 *   icon: <CustomIcon />,
 *   duration: 5000,
 *   position: 'top-right',
 * });
 */
const toast = {
	success: (message: string, options?: ToastOptions) => {
		return sonnerToast.success(message, options);
	},
	error: (message: string, options?: ToastOptions) => {
		return sonnerToast.error(message, options);
	},
	warning: (message: string, options?: ToastOptions) => {
		return sonnerToast.warning(message, options);
	},
	info: (message: string, options?: ToastOptions) => {
		return sonnerToast.info(message, options);
	},
	loading: (message: string, options?: ToastOptions) => {
		return sonnerToast.loading(message, options);
	},
};

export { toast };
export { Toaster } from "./toaster";
