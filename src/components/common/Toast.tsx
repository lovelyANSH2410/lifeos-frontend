import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle, Info, Crown } from 'lucide-react';
import { useScreenSize } from '@/hooks/useScreenSize';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'upgrade';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  const screenSize = useScreenSize();

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'upgrade':
        return <Crown className="w-5 h-5 text-purple-400" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 shadow-emerald-500/20';
      case 'error':
        return 'border-rose-500/40 shadow-rose-500/20';
      case 'warning':
        return 'border-amber-500/40 shadow-amber-500/20';
      case 'upgrade':
        return 'border-purple-500/50 shadow-purple-500/30';
      default:
        return 'border-indigo-500/40 shadow-indigo-500/20';
    }
  };

  return (
    <div
      className={`
        ${getBackgroundGradient()}
        border rounded-xl shadow-2xl backdrop-blur-sm
        bg-[#0F131F]/95
        ${screenSize === 'mobile' ? 'p-3' : 'p-4'}
        min-w-[280px] max-w-[400px]
        animate-slide-in-right
        flex items-start gap-3
        relative overflow-hidden
        hover:shadow-purple-500/20 transition-shadow
      `}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Icon with background */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="p-1.5 rounded-lg bg-white/5">
          {getIcon()}
        </div>
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={`text-white font-medium ${screenSize === 'mobile' ? 'text-sm' : 'text-base'} leading-relaxed`}>
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Close toast"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>

      {/* Progress bar */}
      {toast.duration !== 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-progress"
            style={{
              animation: `progress ${toast.duration || 5000}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const screenSize = useScreenSize();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={`
        fixed z-[10001] pointer-events-none
        ${screenSize === 'mobile' 
          ? 'top-4 left-4 right-4' 
          : 'top-6 right-6'
        }
        flex flex-col gap-3
      `}
      style={{ pointerEvents: 'none' }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{ pointerEvents: 'auto' }}
          className="animate-slide-in-right"
        >
          <ToastItem toast={toast} onClose={() => onClose(toast.id)} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
