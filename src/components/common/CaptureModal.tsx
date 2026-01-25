import React, { useState } from 'react';
import { Lightbulb, BookOpen, FileText, X } from 'lucide-react';
import { Tab } from '@/types';
import BottomSheet from './BottomSheet';
import { useScreenSize } from '@/hooks/useScreenSize';
import { createPortal } from 'react-dom';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}

const CaptureModal: React.FC<CaptureModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';

  const handleSaveAsIdea = () => {
    if (quickCaptureText.trim()) {
      onNavigate(Tab.Ideas);
      setQuickCaptureText('');
      onClose();
    }
  };

  const handleSaveAsDiary = () => {
    if (quickCaptureText.trim()) {
      onNavigate(Tab.Journal);
      setQuickCaptureText('');
      onClose();
    }
  };

  const handleSaveAsNote = () => {
    if (quickCaptureText.trim()) {
      // Note functionality - could navigate to a notes view or just close
      setQuickCaptureText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className="p-6 space-y-4">
      <textarea
        value={quickCaptureText}
        onChange={(e) => setQuickCaptureText(e.target.value)}
        placeholder="What's on your mind?"
        rows={6}
        className="w-full bg-[#0B0F17] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all resize-none"
        autoFocus
      />
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSaveAsIdea}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Save as Idea
        </button>
        <button
          onClick={handleSaveAsDiary}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Save as Diary
        </button>
        <button
          onClick={handleSaveAsNote}
          className="w-full px-4 py-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 text-gray-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Save as Note
        </button>
      </div>
    </div>
  );

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Quick Capture"
        maxHeight="70vh"
      >
        {content}
      </BottomSheet>
    );
  }

  // Desktop/Tablet: Use Modal
  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Quick Capture</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {content}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CaptureModal;
