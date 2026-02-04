import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap,
  Plus,
  Loader2,
  AlertCircle,
  ChevronLeft,
  BookOpen,
  FileText,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  createExam,
  getExams,
  getExamById,
  createSubject,
  getSubjects,
  createTopic,
  getTopics,
  updateTopicProgress
} from '@/services/exam.service';
import { useScreenSize } from '@/hooks/useScreenSize';
import type { Exam, Subject, Topic, CreateExamData, CreateSubjectData, CreateTopicData } from '@/types';

type ViewScreen = 'exams' | 'subjects' | 'topics';

const ExamsView: React.FC = () => {
  const screenSize = useScreenSize();
  const [view, setView] = useState<ViewScreen>('exams');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedExamName, setSelectedExamName] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');

  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isExamFormOpen, setIsExamFormOpen] = useState(false);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setError(null);
      const res = await getExams();
      setExams(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async (examId: string) => {
    try {
      setError(null);
      const res = await getSubjects(examId);
      setSubjects(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTopics = useCallback(async (subjectId: string) => {
    try {
      setError(null);
      const res = await getTopics(subjectId);
      setTopics(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'exams') {
      setIsLoading(true);
      fetchExams();
    }
  }, [view, fetchExams]);

  useEffect(() => {
    if (view === 'subjects' && selectedExamId) {
      setIsLoading(true);
      fetchSubjects(selectedExamId);
    }
  }, [view, selectedExamId, fetchSubjects]);

  useEffect(() => {
    if (view === 'topics' && selectedSubjectId) {
      setIsLoading(true);
      fetchTopics(selectedSubjectId);
    }
  }, [view, selectedSubjectId, fetchTopics]);

  const handleCreateExam = async (data: CreateExamData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createExam(data);
      setIsExamFormOpen(false);
      fetchExams();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubject = async (data: CreateSubjectData) => {
    if (!selectedExamId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await createSubject(selectedExamId, data);
      setIsSubjectFormOpen(false);
      fetchSubjects(selectedExamId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTopic = async (data: CreateTopicData) => {
    if (!selectedSubjectId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await createTopic(selectedSubjectId, data);
      setIsTopicFormOpen(false);
      fetchTopics(selectedSubjectId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopicProgressToggle = async (topic: Topic, field: 'study' | 'rev1' | 'rev2' | 'rev3') => {
    const current = topic[field];
    try {
      await updateTopicProgress(topic._id, { [field]: !current });
      if (selectedSubjectId) fetchTopics(selectedSubjectId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  const goToSubjects = (exam: Exam) => {
    setSelectedExamId(exam._id);
    setSelectedExamName(exam.name);
    setView('subjects');
    setIsLoading(true);
  };

  const goToTopics = (subject: Subject) => {
    setSelectedSubjectId(subject._id);
    setSelectedSubjectName(subject.name);
    setView('topics');
    setIsLoading(true);
  };

  const goBackToExams = () => {
    setView('exams');
    setSelectedExamId(null);
    setSelectedExamName('');
    setSelectedSubjectId(null);
    setSelectedSubjectName('');
  };

  const goBackToSubjects = () => {
    setView('subjects');
    setSelectedSubjectId(null);
    setSelectedSubjectName('');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (view === 'subjects' || view === 'topics') {
    return (
      <div className="space-y-6 animate-enter">
        {/* Breadcrumb header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={view === 'topics' ? goBackToSubjects : goBackToExams}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium truncate">{selectedExamName}</span>
            {view === 'topics' && (
              <>
                <span className="text-gray-500">/</span>
                <span className="text-indigo-400 font-medium truncate">{selectedSubjectName}</span>
              </>
            )}
          </div>
        </div>

        {view === 'subjects' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Subjects</h2>
              <button
                onClick={() => setIsSubjectFormOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {isLoading && subjects.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : subjects.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-gray-500">
                <BookOpen className="w-10 h-10 mb-3 opacity-50" />
                <p className="font-medium">No subjects yet</p>
                <button
                  onClick={() => setIsSubjectFormOpen(true)}
                  className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  Add your first subject
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => goToTopics(s)}
                    className="modern-card p-5 text-left group hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white truncate">{s.name}</span>
                      <span className="text-indigo-400 text-sm font-medium">{s.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSubjectFormOpen && (
              <SubjectFormModal
                onClose={() => setIsSubjectFormOpen(false)}
                onSubmit={handleCreateSubject}
                isLoading={isSubmitting}
              />
            )}
          </>
        )}

        {view === 'topics' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Topics</h2>
              <button
                onClick={() => setIsTopicFormOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Topic
              </button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {isLoading && topics.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : topics.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-gray-500">
                <FileText className="w-10 h-10 mb-3 opacity-50" />
                <p className="font-medium">No topics yet</p>
                <button
                  onClick={() => setIsTopicFormOpen(true)}
                  className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  Add your first topic
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((t) => (
                  <div
                    key={t._id}
                    className="modern-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{t.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{t.progress}% complete</p>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {(['study', 'rev1', 'rev2', 'rev3'] as const).map((key) => {
                        const label = key === 'study' ? 'Study' : `Rev ${key.slice(-1)}`;
                        const checked = t[key];
                        return (
                          <button
                            key={key}
                            onClick={() => handleTopicProgressToggle(t, key)}
                            className="flex items-center gap-2 text-sm"
                          >
                            {checked ? (
                              <CheckSquare className="w-5 h-5 text-indigo-400" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                            )}
                            <span className={checked ? 'text-indigo-400' : 'text-gray-400'}>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTopicFormOpen && (
              <TopicFormModal
                onClose={() => setIsTopicFormOpen(false)}
                onSubmit={handleCreateTopic}
                isLoading={isSubmitting}
              />
            )}
          </>
        )}
      </div>
    );
  }

  // Main exams list
  return (
    <div className="space-y-8 animate-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Exams & Study</h2>
          <p className="text-sm text-gray-400 mt-1">Track exams, subjects, and revision progress</p>
        </div>
        <button
          onClick={() => setIsExamFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Exam
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isLoading && exams.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : exams.length === 0 ? (
        <div
          onClick={() => setIsExamFormOpen(true)}
          className="border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-gray-500 hover:border-gray-700 hover:bg-white/5 transition-all cursor-pointer"
        >
          <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-bold">No exams yet</p>
          <p className="text-sm mt-2">Add your first exam to start tracking</p>
        </div>
      ) : (
        <div
          className={`grid gap-4 sm:gap-6 ${
            screenSize === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
          }`}
        >
          {exams.map((exam) => (
            <button
              key={exam._id}
              onClick={() => goToSubjects(exam)}
              className="modern-card p-6 text-left group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{exam.name}</h3>
                  {exam.examDate && (
                    <p className="text-sm text-gray-400">{formatDate(exam.examDate)}</p>
                  )}
                </div>
                <span className="text-indigo-400 text-sm font-bold">{exam.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${exam.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {isExamFormOpen && (
        <ExamFormModal
          onClose={() => setIsExamFormOpen(false)}
          onSubmit={handleCreateExam}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

// Simple form modals
interface ExamFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateExamData) => Promise<void>;
  isLoading: boolean;
}

const ExamFormModal: React.FC<ExamFormModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setErr('Name is required');
      return;
    }
    try {
      await onSubmit({ name: trimmed, examDate: examDate || undefined });
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">Add Exam</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JEE Mains 2025"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Exam date (optional)</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

interface SubjectFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateSubjectData) => Promise<void>;
  isLoading: boolean;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setErr('Name is required');
      return;
    }
    try {
      await onSubmit({ name: trimmed });
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">Add Subject</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

interface TopicFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateTopicData) => Promise<void>;
  isLoading: boolean;
}

const TopicFormModal: React.FC<TopicFormModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setErr('Name is required');
      return;
    }
    try {
      await onSubmit({ name: trimmed });
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">Add Topic</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Newton's Laws"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default ExamsView;
