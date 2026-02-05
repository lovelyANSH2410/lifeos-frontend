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
  Square,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  createExam,
  getExams,
  updateExam,
  deleteExam,
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  updateTopicProgress
} from '@/services/exam.service';
import {
  createStudyEvent,
  getStudyEvents,
  getTodayStudyEvents,
  completeStudyEvent
} from '@/services/studyEvent.service';
import { useScreenSize } from '@/hooks/useScreenSize';
import type {
  Exam,
  Subject,
  Topic,
  CreateExamData,
  CreateSubjectData,
  CreateTopicData,
  StudyEvent,
  CreateStudyEventData
} from '@/types';

type ViewScreen = 'exams' | 'subjects' | 'topics';
type MainTab = 'exams' | 'events';

const ExamsView: React.FC = () => {
  const screenSize = useScreenSize();
  const [activeTab, setActiveTab] = useState<MainTab>('exams');
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
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Study Events state
  const [studyEvents, setStudyEvents] = useState<StudyEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<StudyEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<StudyEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

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
      setEditingExam(null);
      fetchExams();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExam = async (data: CreateExamData) => {
    if (!editingExam) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateExam(editingExam._id, data);
      setIsExamFormOpen(false);
      setEditingExam(null);
      fetchExams();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Delete this exam and all its subjects and topics?')) return;
    try {
      setError(null);
      await deleteExam(examId);
      fetchExams();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete exam');
    }
  };

  const handleCreateSubject = async (data: CreateSubjectData) => {
    if (!selectedExamId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await createSubject(selectedExamId, data);
      setIsSubjectFormOpen(false);
      setEditingSubject(null);
      fetchSubjects(selectedExamId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubject = async (data: CreateSubjectData) => {
    if (!editingSubject) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateSubject(editingSubject._id, data);
      setIsSubjectFormOpen(false);
      setEditingSubject(null);
      if (selectedExamId) fetchSubjects(selectedExamId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Delete this subject and all its topics?')) return;
    try {
      setError(null);
      await deleteSubject(subjectId);
      if (selectedExamId) fetchSubjects(selectedExamId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete subject');
    }
  };

  const handleCreateTopic = async (data: CreateTopicData) => {
    if (!selectedSubjectId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await createTopic(selectedSubjectId, data);
      setIsTopicFormOpen(false);
      setEditingTopic(null);
      fetchTopics(selectedSubjectId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTopic = async (data: CreateTopicData) => {
    if (!editingTopic) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateTopic(editingTopic._id, data);
      setIsTopicFormOpen(false);
      setEditingTopic(null);
      if (selectedSubjectId) fetchTopics(selectedSubjectId);
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Delete this topic?')) return;
    try {
      setError(null);
      await deleteTopic(topicId);
      if (selectedSubjectId) fetchTopics(selectedSubjectId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete topic');
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

  // Study Events handlers
  const fetchStudyEvents = useCallback(async (month: string) => {
    try {
      setIsLoadingEvents(true);
      setError(null);
      const res = await getStudyEvents(month);
      setStudyEvents(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load study events');
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const fetchTodayEvents = useCallback(async () => {
    try {
      setError(null);
      const res = await getTodayStudyEvents();
      setTodayEvents(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load today\'s events');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchStudyEvents(currentMonth);
      fetchTodayEvents();
    }
  }, [activeTab, currentMonth, fetchStudyEvents, fetchTodayEvents]);

  const handleCreateStudyEvent = async (data: CreateStudyEventData) => {
    try {
      setIsSubmittingEvent(true);
      setError(null);
      await createStudyEvent(data);
      setIsEventFormOpen(false);
      setEditingEvent(null);
      fetchStudyEvents(currentMonth);
      fetchTodayEvents();
    } catch (err: unknown) {
      throw err;
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleCompleteEvent = async (eventId: string) => {
    try {
      await completeStudyEvent(eventId);
      fetchStudyEvents(currentMonth);
      fetchTodayEvents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to complete event');
    }
  };

  // Main return with tabs
  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Exams & Study</h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === 'exams' ? 'Track exams, subjects, and revision progress' : 'Schedule and track your study sessions'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex p-1 bg-[#151B28] rounded-xl border border-white/5 ${
        screenSize === 'mobile' ? 'overflow-x-auto scroll-smooth snap-x snap-mandatory w-full scrollbar-hide -mx-4 px-4' : 'w-fit'
      }`}>
        {screenSize === 'mobile' && <div className="w-0.5 flex-shrink-0"></div>}
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap snap-start ${
            activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Exams
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap snap-start ${
            activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Study Events
        </button>
        {screenSize === 'mobile' && <div className="w-0.5 flex-shrink-0"></div>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {activeTab === 'exams' && (
        <>
          {view === 'subjects' || view === 'topics' ? (
            <div className="space-y-6">
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
                  <div
                    key={s._id}
                    className="modern-card p-5 text-left group hover:border-indigo-500/30 transition-all flex flex-col"
                  >
                    <button
                      onClick={() => goToTopics(s)}
                      className="flex-1 text-left min-w-0"
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
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setEditingSubject(s); setIsSubjectFormOpen(true); }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(s._id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isSubjectFormOpen && (
              <SubjectFormModal
                onClose={() => { setIsSubjectFormOpen(false); setEditingSubject(null); }}
                onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
                isLoading={isSubmitting}
                subject={editingSubject}
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
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
                      <div className="flex gap-2 ml-auto sm:ml-0">
                        <button
                          onClick={() => { setEditingTopic(t); setIsTopicFormOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(t._id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTopicFormOpen && (
              <TopicFormModal
                onClose={() => { setIsTopicFormOpen(false); setEditingTopic(null); }}
                onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
                isLoading={isSubmitting}
                topic={editingTopic}
              />
            )}
          </>
        )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Exams</h3>
                </div>
                <button
                  onClick={() => setIsExamFormOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Exam
                </button>
              </div>

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
                    <div
                      key={exam._id}
                      className="modern-card p-6 text-left group hover:border-indigo-500/30 transition-all flex flex-col"
                    >
                      <button onClick={() => goToSubjects(exam)} className="flex-1 text-left min-w-0">
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
                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingExam(exam); setIsExamFormOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam._id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'events' && (
        <StudyEventsTab
          events={studyEvents}
          todayEvents={todayEvents}
          isLoading={isLoadingEvents}
          isSubmitting={isSubmittingEvent}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onCreateEvent={() => { setEditingEvent(null); setIsEventFormOpen(true); }}
          onCompleteEvent={handleCompleteEvent}
          onRefresh={() => { fetchStudyEvents(currentMonth); fetchTodayEvents(); }}
        />
      )}

      {/* Modals */}
      {isExamFormOpen && (
        <ExamFormModal
          onClose={() => { setIsExamFormOpen(false); setEditingExam(null); }}
          onSubmit={editingExam ? handleUpdateExam : handleCreateExam}
          isLoading={isSubmitting}
          exam={editingExam}
        />
      )}

      {isEventFormOpen && (
        <StudyEventFormModal
          onClose={() => { setIsEventFormOpen(false); setEditingEvent(null); }}
          onSubmit={handleCreateStudyEvent}
          isLoading={isSubmittingEvent}
          event={editingEvent}
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
  exam?: Exam | null;
}

const ExamFormModal: React.FC<ExamFormModalProps> = ({ onClose, onSubmit, isLoading, exam }) => {
  const [name, setName] = useState(exam?.name ?? '');
  const [examDate, setExamDate] = useState(
    exam?.examDate ? new Date(exam.examDate).toISOString().slice(0, 10) : ''
  );
  const [err, setErr] = useState<string | null>(null);

  React.useEffect(() => {
    if (exam) {
      setName(exam.name);
      setExamDate(exam.examDate ? new Date(exam.examDate).toISOString().slice(0, 10) : '');
    } else {
      setName('');
      setExamDate('');
    }
  }, [exam]);

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
        <h3 className="text-lg font-bold text-white mb-4">{exam ? 'Edit Exam' : 'Add Exam'}</h3>
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : exam ? 'Save' : 'Add'}
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
  subject?: Subject | null;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({ onClose, onSubmit, isLoading, subject }) => {
  const [name, setName] = useState(subject?.name ?? '');
  const [err, setErr] = useState<string | null>(null);

  React.useEffect(() => {
    setName(subject?.name ?? '');
  }, [subject]);

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
        <h3 className="text-lg font-bold text-white mb-4">{subject ? 'Edit Subject' : 'Add Subject'}</h3>
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : subject ? 'Save' : 'Add'}
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
  topic?: Topic | null;
}

const TopicFormModal: React.FC<TopicFormModalProps> = ({ onClose, onSubmit, isLoading, topic }) => {
  const [name, setName] = useState(topic?.name ?? '');
  const [err, setErr] = useState<string | null>(null);

  React.useEffect(() => {
    setName(topic?.name ?? '');
  }, [topic]);

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
        <h3 className="text-lg font-bold text-white mb-4">{topic ? 'Edit Topic' : 'Add Topic'}</h3>
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : topic ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

// Study Events Tab Component
interface StudyEventsTabProps {
  events: StudyEvent[];
  todayEvents: StudyEvent[];
  isLoading: boolean;
  isSubmitting: boolean;
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onCreateEvent: () => void;
  onCompleteEvent: (eventId: string) => void;
  onRefresh: () => void;
}

const StudyEventsTab: React.FC<StudyEventsTabProps> = ({
  events,
  todayEvents,
  isLoading,
  currentMonth,
  onMonthChange,
  onCreateEvent,
  onCompleteEvent
}) => {
  const screenSize = useScreenSize();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const getDaysInMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    const [year, month] = currentMonth.split('-').map(Number);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      if (!e.date) return false;
      const eventDate = new Date(e.date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    let newMonth = month + (direction === 'next' ? 1 : -1);
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const monthName = new Date(`${currentMonth}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Today's Events Section */}
      <div className="modern-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Today's Events</h3>
          </div>
          <button
            onClick={onCreateEvent}
            className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-colors"
            title="Add Event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {todayEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No events scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayEvents.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{event.title}</p>
                  {event.isRecurring && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {event.recurrence?.type === 'daily' ? 'Daily' :
                       event.recurrence?.type === 'weekly' ? 'Weekly' :
                       `Custom (${event.recurrence?.daysOfWeek?.map(d => getDayName(d)).join(', ') || ''})`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onCompleteEvent(event._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    event.completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400'
                  }`}
                  title={event.completed ? 'Completed' : 'Mark as complete'}
                >
                  {event.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Section */}
      <div className="modern-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white">{monthName}</h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rotate-180"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, idx) => {
              const dayEvents = getEventsForDate(day || 0);
              const isToday = day && (() => {
                const today = new Date();
                const [year, month] = currentMonth.split('-').map(Number);
                return today.getDate() === day && today.getMonth() + 1 === month && today.getFullYear() === year;
              })();
              
              return (
                <div
                  key={idx}
                  className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg border transition-all ${
                    day
                      ? isToday
                        ? 'bg-indigo-500/20 border-indigo-500/50'
                        : 'bg-white/5 border-white/10 hover:border-indigo-500/30'
                      : 'border-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        isToday ? 'text-indigo-400' : 'text-gray-400'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event._id}
                            className={`text-[10px] sm:text-xs px-1 py-0.5 rounded truncate ${
                              event.completed
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-indigo-500/20 text-indigo-400'
                            }`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Study Event Form Modal
interface StudyEventFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateStudyEventData) => Promise<void>;
  isLoading: boolean;
  event?: StudyEvent | null;
}

const StudyEventFormModal: React.FC<StudyEventFormModalProps> = ({ onClose, onSubmit, isLoading, event }) => {
  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ? new Date(event.date).toISOString().slice(0, 10) : '');
  const [isRecurring, setIsRecurring] = useState(event?.isRecurring ?? false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'custom'>(event?.recurrence?.type || 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(event?.recurrence?.daysOfWeek || []);
  const [err, setErr] = useState<string | null>(null);

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date ? new Date(event.date).toISOString().slice(0, 10) : '');
      setIsRecurring(event.isRecurring);
      setRecurrenceType(event.recurrence?.type || 'daily');
      setDaysOfWeek(event.recurrence?.daysOfWeek || []);
    } else {
      setTitle('');
      setDate('');
      setIsRecurring(false);
      setRecurrenceType('daily');
      setDaysOfWeek([]);
    }
  }, [event]);

  const toggleDay = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setErr('Title is required');
      return;
    }

    if (isRecurring && (recurrenceType === 'weekly' || recurrenceType === 'custom') && daysOfWeek.length === 0) {
      setErr('Select at least one day for weekly/custom recurrence');
      return;
    }

    try {
      await onSubmit({
        title: trimmed,
        date: date || undefined,
        isRecurring,
        recurrence: isRecurring ? {
          type: recurrenceType,
          daysOfWeek: recurrenceType === 'daily' ? [] : daysOfWeek
        } : undefined
      });
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0F131F] rounded-2xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">{event ? 'Edit Study Event' : 'Add Study Event'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review Physics Chapter 5"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date (optional for recurring)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded bg-white/5 border-white/10 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="recurring" className="text-sm text-gray-300">Recurring event</label>
          </div>

          {isRecurring && (
            <div className="space-y-3 pl-6 border-l-2 border-indigo-500/30">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recurrence Type</label>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'custom'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRecurrenceType(type);
                        if (type === 'daily') setDaysOfWeek([]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        recurrenceType === type
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {(recurrenceType === 'weekly' || recurrenceType === 'custom') && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Days of Week</label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayLabels.map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                          daysOfWeek.includes(idx)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : event ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default ExamsView;

