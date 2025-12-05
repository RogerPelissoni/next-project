import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastOptions = ExternalToast;

export const toast = {
  success: (message: string, options?: ToastOptions) => sonnerToast.success(message, { ...options, richColors: true }),

  error: (message: string, options?: ToastOptions) => sonnerToast.error(message, { ...options, richColors: true }),

  info: (message: string, options?: ToastOptions) => sonnerToast(message, { ...options }),

  warning: (message: string, options?: ToastOptions) => sonnerToast.warning(message, { ...options, richColors: true }),

  loading: (message: string, options?: ToastOptions) => sonnerToast.loading(message, { ...options }),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => sonnerToast.promise(promise, messages),

  dismiss: (id?: number | string) => sonnerToast.dismiss(id),
};
