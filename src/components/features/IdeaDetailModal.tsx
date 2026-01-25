import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Tag as TagIcon, Clock, Image as ImageIcon } from 'lucide-react';
import type { Idea } from '@/types';

interface IdeaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  onEdit?: (idea: Idea) => void;
  onDelete?: (idea: Idea) => void;
}

const typeLabels: Record<string, string> = {
  curiosity: 'Curiosity',
  learning: 'Learning',
  idea: 'Idea',
  inspiration: 'Inspiration',
  news: 'News',
  question: 'Question',
  random: 'Random'
};

const typeColors: Record<string, string> = {
  curiosity: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  learning: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  idea: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  inspiration: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  news: 'bg-green-500/20 text-green-400 border-green-500/30',
  question: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  random: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

const sourceLabels: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  article: 'Article',
  book: 'Book',
  conversation: 'Conversation',
  random: 'Random'
};

const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  isOpen,
  onClose,
  idea,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !idea) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0F131F] border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {idea.type && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[idea.type] || typeColors.random}`}>
                {typeLabels[idea.type] || idea.type}
              </span>
            )}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(idea.createdAt)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          {idea.title && (
            <h2 className="text-2xl font-bold text-white">{idea.title}</h2>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {idea.content}
            </p>
          </div>

          {/* Image */}
          {idea.image?.url && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={idea.image.url}
                alt="Idea"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            {idea.source && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Source:</span>
                <span className="text-sm text-white">{sourceLabels[idea.source] || idea.source}</span>
              </div>
            )}

            {idea.link && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Link:</span>
                <a
                  href={idea.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  {idea.link}
                </a>
              </div>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="w-4 h-4 text-gray-400" />
                {idea.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Status:</span>
              <span className="text-sm text-white capitalize">{idea.status}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(idea);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to archive this idea?')) {
                    onDelete(idea);
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default IdeaDetailModal;
