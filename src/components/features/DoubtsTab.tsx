import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Loader2, AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';
import type {
  Doubt,
  DoubtPriority,
  DoubtStatus,
  Topic,
  CreateDoubtData,
  UpdateDoubtData
} from '@/types';
import {
  createDoubt,
  getDoubtsBySubject,
  updateDoubt,
  resolveDoubt,
  deleteDoubt
} from '@/services/doubtsApi';
import { useScreenSize } from '@/hooks/useScreenSize';

interface DoubtsTabProps {
  subjectId: string;
  topics: Topic[];
}

type DoubtFormMode = 'create' | 'edit';

interface DoubtFormModalProps {
  mode: DoubtFormMode;
  doubt?: Doubt | null;
  topics: Topic[];
  onClose: () => void;
  onSubmit: (payload: CreateDoubtData | UpdateDoubtData, files: File[]) => Promise<void>;
  isLoading: boolean;
}

interface DoubtDetailModalProps {
  doubt: Doubt;
  topicName?: string;
  onClose: () => void;
  onResolve: (resolutionNote?: string) => Promise<void>;
  isResolving: boolean;
}

const priorityColors: Record<DoubtPriority, string> = {
  low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  high: 'bg-red-500/10 text-red-300 border-red-500/30'
};

const statusColors: Record<DoubtStatus, string> = {
  open: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  resolved: 'bg-gray-500/10 text-gray-300 border-gray-500/30'
};

const DoubtsTab: React.FC<DoubtsTabProps> = ({ subjectId, topics }) => {
  const screenSize = useScreenSize();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resolving, setResolving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<DoubtStatus | 'all'>('open');
  const [priorityFilter, setPriorityFilter] = useState<DoubtPriority | 'all'>('all');

  const [formMode, setFormMode] = useState<DoubtFormMode>('create');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingDoubt, setEditingDoubt] = useState<Doubt | null>(null);

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  const loadDoubts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDoubtsBySubject(subjectId, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        priority: priorityFilter === 'all' ? undefined : priorityFilter
      });
      setDoubts(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load doubts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!subjectId) return;
    loadDoubts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, statusFilter, priorityFilter]);

  const handleCreate = async (payload: CreateDoubtData, files: File[]) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await createDoubt(subjectId, payload, files);
      // Optimistic: add to top of list
      setDoubts((prev) => [res.data, ...prev]);
      setFormOpen(false);
      setEditingDoubt(null);
    } catch (err: unknown) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload: UpdateDoubtData, files: File[]) => {
    if (!editingDoubt) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await updateDoubt(editingDoubt._id, payload, files);
      setDoubts((prev) =>
        prev.map((d) => (d._id === res.data._id ? res.data : d))
      );
      if (selectedDoubt && selectedDoubt._id === res.data._id) {
        setSelectedDoubt(res.data);
      }
      setFormOpen(false);
      setEditingDoubt(null);
    } catch (err: unknown) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doubt: Doubt) => {
    if (!confirm('Delete this doubt?')) return;
    try {
      setError(null);
      await deleteDoubt(doubt._id);
      setDoubts((prev) => prev.filter((d) => d._id !== doubt._id));
      if (selectedDoubt && selectedDoubt._id === doubt._id) {
        setSelectedDoubt(null);
        setDetailOpen(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete doubt');
    }
  };

  const handleResolve = async (doubt: Doubt, resolutionNote?: string) => {
    try {
      setResolving(true);
      setError(null);
      const res = await resolveDoubt(doubt._id, { resolutionNote });
      setDoubts((prev) =>
        prev.map((d) => (d._id === res.data._id ? res.data : d))
      );
      setSelectedDoubt(res.data);
    } catch (err: unknown) {
      throw err;
    } finally {
      setResolving(false);
    }
  };

  const topicNameById = (topicId?: string) => {
    if (!topicId) return undefined;
    const topic = topics.find((t) => t._id === topicId);
    return topic?.name;
  };

  const filteredDoubts = doubts;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Doubts</h2>
          <p className="text-sm text-gray-400 mt-1">
            Capture and resolve doubts for this subject
          </p>
        </div>
        <button
          onClick={() => {
            setFormMode('create');
            setEditingDoubt(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Doubt
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DoubtStatus | 'all')}
            className="bg-white/5 border border-white/10 text-xs text-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Priority</span>
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as DoubtPriority | 'all')
            }
            className="bg-white/5 border border-white/10 text-xs text-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-xs sm:text-sm text-red-300">{error}</p>
        </div>
      )}

      {loading && filteredDoubts.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : filteredDoubts.length === 0 ? (
        <div className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-gray-500">
          <CheckCircle2 className="w-10 h-10 mb-3 opacity-50" />
          <p className="font-medium">No doubts yet</p>
          <button
            onClick={() => {
              setFormMode('create');
              setEditingDoubt(null);
              setFormOpen(true);
            }}
            className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Add your first doubt
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 ${
            screenSize === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {filteredDoubts.map((doubt) => {
            const topicName = topicNameById(doubt.topicId);
            const priorityClass = priorityColors[doubt.priority];
            const statusClass = statusColors[doubt.status];
            const isResolved = doubt.status === 'resolved';

            return (
              <div
                key={doubt._id}
                className={`modern-card p-4 sm:p-5 flex flex-col gap-3 ${
                  isResolved ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      setSelectedDoubt(doubt);
                      setDetailOpen(true);
                    }}
                  >
                    <h3 className="font-semibold text-white truncate">
                      {doubt.title}
                    </h3>
                    {topicName && (
                      <p className="text-xs text-indigo-300 mt-1 truncate">
                        Topic: {topicName}
                      </p>
                    )}
                    {doubt.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {doubt.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityClass}`}
                    >
                      {doubt.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass}`}
                    >
                      {doubt.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created{' '}
                    {new Date(doubt.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDoubt(doubt);
                        setFormMode('edit');
                        setFormOpen(true);
                      }}
                      className="text-indigo-300 hover:text-indigo-200 text-xs font-medium"
                    >
                      View / Edit
                    </button>
                    {!isResolved && (
                      <button
                        onClick={() => {
                          setSelectedDoubt(doubt);
                          setDetailOpen(true);
                        }}
                        className="text-emerald-300 hover:text-emerald-200 text-xs font-medium"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doubt)}
                      className="text-red-300 hover:text-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <DoubtFormModal
          mode={formMode}
          doubt={editingDoubt}
          topics={topics}
          onClose={() => {
            setFormOpen(false);
            setEditingDoubt(null);
          }}
          onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
          isLoading={submitting}
        />
      )}

      {detailOpen && selectedDoubt && (
        <DoubtDetailModal
          doubt={selectedDoubt}
          topicName={topicNameById(selectedDoubt.topicId)}
          onClose={() => {
            setDetailOpen(false);
            setSelectedDoubt(null);
          }}
          onResolve={(note?: string) => handleResolve(selectedDoubt, note)}
          isResolving={resolving}
        />
      )}
    </div>
  );
};

const DoubtFormModal: React.FC<DoubtFormModalProps> = ({
  mode,
  doubt,
  topics,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [title, setTitle] = useState(doubt?.title ?? '');
  const [description, setDescription] = useState(doubt?.description ?? '');
  const [topicId, setTopicId] = useState<string>(doubt?.topicId ?? '');
  const [priority, setPriority] = useState<DoubtPriority>(doubt?.priority ?? 'medium');
  const [imageUrls, setImageUrls] = useState<string[]>(
    doubt?.images?.map((img) => img.url) ?? []
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (doubt) {
      setTitle(doubt.title);
      setDescription(doubt.description ?? '');
      setTopicId(doubt.topicId ?? '');
      setPriority(doubt.priority);
      setImageUrls(doubt.images?.map((img) => img.url) ?? []);
      setFiles([]);
    } else {
      setTitle('');
      setDescription('');
      setTopicId('');
      setPriority('medium');
      setImageUrls([]);
      setFiles([]);
    }
  }, [doubt]);

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setImageUrls((prev) => [...prev, trimmed]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErr('Title is required');
      return;
    }

    const payloadImages =
      imageUrls.length > 0
        ? imageUrls.map((url) => ({ url, publicId: url }))
        : undefined;

    const payload: CreateDoubtData | UpdateDoubtData = {
      title: trimmedTitle,
      description: description.trim() || undefined,
      topicId: topicId || undefined,
      priority,
      images: payloadImages
    };

    try {
      await onSubmit(payload, files);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {mode === 'create' ? 'Add Doubt' : 'Edit Doubt'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Confusion about Kirchhoff's Law"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Optional: add more context, examples, or what you've tried."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Topic (optional)
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Unlinked</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DoubtPriority)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Image URLs (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL and click Add"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 rounded-xl bg-white/5 text-xs text-gray-200 hover:bg-white/10 transition-colors"
              >
                Add
              </button>
            </div>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url) => (
                  <div
                    key={url}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 text-[10px] text-gray-200"
                  >
                    <span className="max-w-[140px] truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Upload Images (Cloudinary)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="block w-full text-xs text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-gray-100 hover:file:bg-white/20 cursor-pointer"
            />
            {files.length > 0 && (
              <p className="mt-1 text-[11px] text-gray-400">
                {files.length} image{files.length > 1 ? 's' : ''} selected (max 5MB each)
              </p>
            )}
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : mode === 'create' ? (
                'Add Doubt'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const DoubtDetailModal: React.FC<DoubtDetailModalProps> = ({
  doubt,
  topicName,
  onClose,
  onResolve,
  isResolving
}) => {
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleResolveClick = async () => {
    setError(null);
    try {
      await onResolve(note.trim() || undefined);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to resolve doubt');
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{doubt.title}</h3>
            {topicName && (
              <p className="text-xs text-indigo-300">Topic: {topicName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityColors[doubt.priority]}`}
          >
            {doubt.priority.toUpperCase()}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[doubt.status]}`}
          >
            {doubt.status.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            Created{' '}
            {new Date(doubt.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {doubt.description && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">
              {doubt.description}
            </p>
          </div>
        )}

        {doubt.images && doubt.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Images</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {doubt.images.map((img) => (
                <a
                  key={img.publicId}
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/40 transition-colors"
                >
                  <img
                    src={img.url}
                    alt="Doubt"
                    className="w-full h-24 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {doubt.status === 'resolved' && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-1">
              Resolution
            </h4>
            {doubt.resolutionNote ? (
              <p className="text-sm text-emerald-200 whitespace-pre-wrap">
                {doubt.resolutionNote}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Marked as resolved.</p>
            )}
            {doubt.resolvedAt && (
              <p className="text-[11px] text-gray-500 mt-1">
                Resolved{' '}
                {new Date(doubt.resolvedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        )}

        {doubt.status === 'open' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400">
              Resolution Note (optional)
            </h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add a short explanation or link for future reference."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleResolveClick}
                disabled={isResolving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isResolving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Resolved
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DoubtsTab;

