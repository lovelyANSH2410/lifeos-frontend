import React, { useState, useEffect } from 'react';
import { Shield, FileText, Key, Eye, EyeOff, Copy, Image as IconImage, Plus, Loader2, AlertCircle, Edit2, Trash2, Download, ExternalLink } from 'lucide-react';
import { createVaultItem, getVaultItems, revealPassword, updateVaultItem, deleteVaultItem } from '@/services/vault.service';
import { createVaultDocument, getVaultDocuments, getDocumentSignedUrl, deleteVaultDocument } from '@/services/document.service';
import type { VaultItem, CreateVaultItemData, VaultDocument, CreateVaultDocumentData } from '@/types';
import CredentialForm from './CredentialForm';
import DocumentForm from './DocumentForm';

const VaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creds' | 'docs'>('creds');
  
  // Credentials state
  const [credentials, setCredentials] = useState<VaultItem[]>([]);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);
  const [isSubmittingCreds, setIsSubmittingCreds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCredFormOpen, setIsCredFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<VaultItem | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<VaultDocument | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch credentials only when credentials tab is active
  const fetchCredentials = async () => {
    if (activeTab !== 'creds') return;
    
    try {
      setIsLoadingCreds(true);
      setError(null);
      const response = await getVaultItems();
      setCredentials(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load credentials');
      console.error('Fetch credentials error:', err);
    } finally {
      setIsLoadingCreds(false);
    }
  };

  // Fetch documents only when documents tab is active
  const fetchDocuments = async () => {
    if (activeTab !== 'docs') return;
    
    try {
      setIsLoadingDocs(true);
      setError(null);
      const response = await getVaultDocuments({
        isArchived: false,
        category: categoryFilter || undefined
      });
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
      console.error('Fetch documents error:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'creds') {
      fetchCredentials();
    } else if (activeTab === 'docs') {
      fetchDocuments();
    }
  }, [activeTab, categoryFilter]);

  // Credentials handlers
  const handleCreateCredential = async (data: CreateVaultItemData) => {
    try {
      setIsSubmittingCreds(true);
      setError(null);
      await createVaultItem(data);
      setIsCredFormOpen(false);
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to create credential');
      throw err;
    } finally {
      setIsSubmittingCreds(false);
    }
  };

  const handleEditCredential = async (data: CreateVaultItemData) => {
    if (!editingCredential) return;
    
    try {
      setIsSubmittingCreds(true);
      setError(null);
      await updateVaultItem(editingCredential._id, data);
      setIsCredFormOpen(false);
      setEditingCredential(null);
      setRevealedPasswords(prev => {
        const updated = { ...prev };
        delete updated[editingCredential._id];
        return updated;
      });
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to update credential');
      throw err;
    } finally {
      setIsSubmittingCreds(false);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    try {
      await deleteVaultItem(id);
      setRevealedPasswords(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to delete credential');
      alert(err.message || 'Failed to delete credential');
    }
  };

  const handleRevealPassword = async (id: string) => {
    if (revealedPasswords[id]) {
      setRevealedPasswords(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    try {
      const response = await revealPassword(id);
      setRevealedPasswords(prev => ({
        ...prev,
        [id]: response.data.password
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to reveal password');
      alert(err.message || 'Failed to reveal password');
    }
  };

  const handleCopyPassword = async (id: string) => {
    const password = revealedPasswords[id];
    if (!password) {
      try {
        const response = await revealPassword(id);
        const pwd = response.data.password;
        setRevealedPasswords(prev => ({
          ...prev,
          [id]: pwd
        }));
        await navigator.clipboard.writeText(pwd);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err: any) {
        setError(err.message || 'Failed to copy password');
        alert(err.message || 'Failed to copy password');
      }
    } else {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Documents handlers
  const handleCreateDocument = async (data: CreateVaultDocumentData) => {
    try {
      setIsSubmittingDocs(true);
      setError(null);
      await createVaultDocument(data);
      setIsDocFormOpen(false);
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      throw err;
    } finally {
      setIsSubmittingDocs(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteVaultDocument(id);
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      alert(err.message || 'Failed to delete document');
    }
  };

  const handleViewDocument = async (id: string) => {
    try {
      const response = await getDocumentSignedUrl(id);
      // Open signed URL in new tab
      window.open(response.data.signedUrl, '_blank');
    } catch (err: any) {
      setError(err.message || 'Failed to load document');
      alert(err.message || 'Failed to load document');
    }
  };

  const handleDownloadDocument = async (id: string) => {
    try {
      const response = await getDocumentSignedUrl(id);
      // Download the file
      const link = document.createElement('a');
      link.href = response.data.signedUrl;
      link.download = '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message || 'Failed to download document');
      alert(err.message || 'Failed to download document');
    }
  };

  const getFileIcon = (format?: string) => {
    if (format === 'pdf') {
      return <FileText className="w-6 h-6 text-rose-400" />;
    }
    return <IconImage className="w-6 h-6 text-indigo-400" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openCreateCredForm = () => {
    setEditingCredential(null);
    setIsCredFormOpen(true);
  };

  const openEditCredForm = (credential: VaultItem) => {
    setEditingCredential(credential);
    setIsCredFormOpen(true);
  };

  const openCreateDocForm = () => {
    setEditingDocument(null);
    setIsDocFormOpen(true);
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'identity', label: 'Identity' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'finance', label: 'Finance' },
    { value: 'medical', label: 'Medical' },
    { value: 'property', label: 'Property' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" /> Secure Vault
          </h2>
          <p className="text-gray-400">Shared credentials and important docs.</p>
        </div>
        {activeTab === 'creds' && (
          <button
            onClick={openCreateCredForm}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        )}
        {activeTab === 'docs' && (
          <button
            onClick={openCreateDocForm}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      <div className="flex p-1 bg-[#151B28] rounded-xl border border-white/5 w-fit">
         <button 
           onClick={() => setActiveTab('creds')}
           className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'creds' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
         >
           Credentials
         </button>
         <button 
           onClick={() => setActiveTab('docs')}
           className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
         >
           Documents
         </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {activeTab === 'creds' ? (
        <div className="grid grid-cols-1 gap-4">
          {isLoadingCreds && credentials.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : credentials.length === 0 ? (
            <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateCredForm}>
              <Key className="w-8 h-8 mb-4 opacity-50" />
              <span className="font-bold">No credentials yet</span>
              <span className="text-sm text-gray-500 mt-2">Click to add your first credential</span>
            </div>
          ) : (
            credentials.map(cred => (
              <div key={cred._id} className="modern-card p-4 flex items-center justify-between group hover:border-emerald-500/30">
                <div className="flex items-center gap-4 flex-1">
                   <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Key className="w-5 h-5 text-gray-400" />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-bold text-white">{cred.title}</h3>
                      {cred.username && (
                        <p className="text-xs text-gray-500">{cred.username}</p>
                      )}
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="bg-[#0B0F17] px-3 py-1.5 rounded border border-gray-700 font-mono text-sm text-gray-300 min-w-[120px] text-center">
                      {revealedPasswords[cred._id] || '••••••••••••'}
                   </div>
                   <button 
                     onClick={() => handleRevealPassword(cred._id)}
                     className="text-gray-500 hover:text-white transition-colors"
                     title={revealedPasswords[cred._id] ? 'Hide password' : 'Reveal password'}
                   >
                      {revealedPasswords[cred._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                   <button 
                     onClick={() => handleCopyPassword(cred._id)}
                     className={`transition-colors ${copiedId === cred._id ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}
                     title="Copy password"
                   >
                      <Copy className="w-4 h-4" />
                   </button>
                   <button
                     onClick={() => openEditCredForm(cred)}
                     className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                     title="Edit credential"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button
                     onClick={() => handleDeleteCredential(cred._id)}
                     className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                     title="Delete credential"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          {isLoadingDocs && documents.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[300px] text-gray-600 hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer" onClick={openCreateDocForm}>
              <FileText className="w-8 h-8 mb-4 opacity-50" />
              <span className="font-bold">No documents yet</span>
              <span className="text-sm text-gray-500 mt-2">Click to upload your first document</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div key={doc._id} className="modern-card p-5 flex flex-col items-center justify-center text-center group hover:bg-[#1A2235] relative">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                    {getFileIcon(doc.file.format)}
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{doc.title}</h3>
                  {doc.expiryDate && (
                    <p className="text-xs text-gray-500 mb-2">
                      Expires: {formatDate(doc.expiryDate)}
                    </p>
                  )}
                  {doc.issuedDate && (
                    <p className="text-xs text-gray-500 mb-2">
                      Issued: {formatDate(doc.issuedDate)}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewDocument(doc._id)}
                      className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
                      title="View document"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc._id)}
                      className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Credential Form Modal */}
      <CredentialForm
        isOpen={isCredFormOpen}
        onClose={() => {
          setIsCredFormOpen(false);
          setEditingCredential(null);
        }}
        onSubmit={editingCredential ? handleEditCredential : handleCreateCredential}
        credential={editingCredential}
        isLoading={isSubmittingCreds}
      />

      {/* Document Form Modal */}
      <DocumentForm
        isOpen={isDocFormOpen}
        onClose={() => {
          setIsDocFormOpen(false);
          setEditingDocument(null);
        }}
        onSubmit={handleCreateDocument}
        document={editingDocument}
        isLoading={isSubmittingDocs}
      />
    </div>
  );
};

export default VaultView;
