'use client'
import { getErrorMessage } from '@/lib/error';
import { IQueryResponse } from '@/types';
import { toast } from 'sonner';

// Define position types (matching Sonner's positions)
type ToastPosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';

interface ToastOptions {
    type: 'success' | 'error' | 'info' | 'warning' | 'default' | 'loading';
    message: string;
    description?: string;
    duration?: number;
    position?: ToastPosition;
    important?: boolean;
    action?: {
        label: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };
    cancel?: {
        label: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };
    icon?: React.ReactNode;
    id?: string | number;

}

/**
 * Unified toast helper with object syntax (for those who prefer it)
 */
export const showToast = ({

    type,
    message,
    description,
    duration = 3000,
    position = 'top-right',
    important = false,
    action,
    cancel,
    icon,
    id
}: ToastOptions) => {

    const options = {
        description,
        duration,
        position,
        important,
        action,
        cancel,
        icon,
        id
    };

    switch (type) {
        case 'success':
            return toast.success(message, options);
        case 'error':
            return toast.error(message, options);
        case 'info':
            return toast.info(message, options);
        case 'warning':
            return toast.warning(message, options);
        case 'loading':
            return toast.loading(message, options);
        default:
            return toast(message, options);
    }
};

export const smartToast = ({ success, message, error, }: Partial<Omit<IQueryResponse, 'error'> & { error: unknown }>) => {
    const msg = error ? getErrorMessage(error) : message
    const type = error ? false : success

    switch (type) {
        case true:
            return toast.success(msg, { position: 'bottom-center' });
        case false:
            return toast.error(msg, { position: 'bottom-center' });
        default:
            return toast(msg, { position: 'bottom-center' });
    }
};