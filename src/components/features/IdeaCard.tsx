import React from 'react';
import { Clock, Tag as TagIcon, ExternalLink, Pin, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
  onView?: (idea: Idea) => void;
  onEdit?: (idea: Idea) => void;
  onDelete?: (idea: Idea) => void;
  onStatusChange?: (idea: Idea, newStatus: Idea['status']) => void;
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

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getContentPreview = (content: string, maxLines: number = 3) => {
    const lines = content.split('\n');
    if (lines.length <= maxLines) return content;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  return (
    <div 
      className="modern-card p-5 group hover:border-indigo-500/30 transition-all cursor-pointer"
      onClick={() => onView?.(idea)}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {idea.type && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[idea.type] || typeColors.random}`}>
              {typeLabels[idea.type] || idea.type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(idea.createdAt)}</span>
        </div>
      </div>

      {/* Title */}
      {idea.title && (
        <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
      )}

      {/* Content Preview */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-3 whitespace-pre-wrap">
        {getContentPreview(idea.content)}
      </p>

      {/* Image Preview */}
      {idea.image?.url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={idea.image.url}
            alt="Idea"
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-3 flex-wrap">
          {idea.source && (
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              {sourceLabels[idea.source] || idea.source}
            </span>
          )}
          {idea.link && (
            <a
              href={idea.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Link
            </a>
          )}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {idea.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {idea.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{idea.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Actions (on hover) */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(idea);
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-400" />
          </button>
          {onStatusChange && (
            <select
              value={idea.status}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(idea, e.target.value as Idea['status']);
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 focus:ring-1 focus:ring-indigo-500/50 outline-none cursor-pointer"
            >
              <option value="inbox">Inbox</option>
              <option value="saved">Saved</option>
              <option value="explored">Explored</option>
              <option value="archived">Archived</option>
            </select>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(idea);
            }}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
