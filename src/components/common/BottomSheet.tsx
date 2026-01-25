import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = '90vh'
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (sheetRef.current) {
      const touch = e.touches[0];
      startY.current = touch.clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    
    const touch = e.touches[0];
    currentY.current = touch.clientY;
    const deltaY = currentY.current - startY.current;
    
    // Only allow downward dragging
    if (deltaY > 0) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !sheetRef.current) return;
    
    const deltaY = currentY.current - startY.current;
    const threshold = 100; // pixels to drag before closing
    
    if (deltaY > threshold) {
      onClose();
    } else {
      // Snap back
      sheetRef.current.style.transform = 'translateY(0)';
    }
    
    isDragging.current = false;
    startY.current = 0;
    currentY.current = 0;
  };

  if (!isOpen) return null;

  const content = (
    <div 
      className="fixed inset-0 z-[10000] flex items-end sm:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full bg-[#0F131F] rounded-t-3xl border-t border-white/10 shadow-2xl animate-slide-up"
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: `calc(${maxHeight} - ${title ? '120px' : '60px'})` }}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default BottomSheet;
