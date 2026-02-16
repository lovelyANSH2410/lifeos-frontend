import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer, { Toast, ToastType } from '@/components/common/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showUpgrade: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    addToast(message, type, duration);
  }, [addToast]);

  const showSuccess = useCallback((message: string, duration: number = 5000) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message: string, duration: number = 5000) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message: string, duration: number = 5000) => {
    addToast(message, 'info', duration);
  }, [addToast]);

  const showWarning = useCallback((message: string, duration: number = 5000) => {
    addToast(message, 'warning', duration);
  }, [addToast]);

  const showUpgrade = useCallback((message: string, duration: number = 7000) => {
    addToast(message, 'upgrade', duration);
  }, [addToast]);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showUpgrade,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
