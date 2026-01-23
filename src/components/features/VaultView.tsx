
import React, { useState } from 'react';
import { Shield, FileText, Key, Eye, EyeOff, Copy, Image as IconImage, Plus } from 'lucide-react';
import { Credential, Document } from '@/types';

const VaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creds' | 'docs'>('creds');
  const [showPassword, setShowPassword] = useState<string | null>(null);

  const creds: Credential[] = [
    { id: '1', service: 'Netflix', username: 'alex&jordan', category: 'social' },
    { id: '2', service: 'Chase Joint', username: 'jordan_alex_24', category: 'finance' },
    { id: '3', service: 'Utility Bill', username: 'user_9921', category: 'work' },
  ];

  const docs: Document[] = [
    { id: '1', name: 'Lease Agreement 2024', type: 'pdf', date: 'Jan 12, 2024' },
    { id: '2', name: 'Vaccination Cards', type: 'img', date: 'Aug 05, 2023' },
    { id: '3', name: 'Car Insurance', type: 'pdf', date: 'Mar 20, 2024' },
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

      {activeTab === 'creds' ? (
        <div className="grid grid-cols-1 gap-4">
           {creds.map(cred => (
             <div key={cred.id} className="modern-card p-4 flex items-center justify-between group hover:border-emerald-500/30">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <Key className="w-5 h-5 text-gray-400" />
                   </div>
                   <div>
                      <h3 className="font-bold text-white">{cred.service}</h3>
                      <p className="text-xs text-gray-500">{cred.username}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="bg-[#0B0F17] px-3 py-1.5 rounded border border-gray-700 font-mono text-sm text-gray-300 min-w-[120px] text-center">
                      {showPassword === cred.id ? 'Password123!' : '••••••••••••'}
                   </div>
                   <button onClick={() => setShowPassword(showPassword === cred.id ? null : cred.id)} className="text-gray-500 hover:text-white">
                      {showPassword === cred.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                   <button className="text-gray-500 hover:text-emerald-400">
                      <Copy className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {docs.map(doc => (
              <div key={doc.id} className="modern-card p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1A2235]">
                 <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                    {doc.type === 'pdf' ? <FileText className="w-6 h-6 text-rose-400" /> : <IconImage className="w-6 h-6 text-indigo-400" />}
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">{doc.name}</h3>
                 <p className="text-xs text-gray-500">{doc.date}</p>
              </div>
           ))}
           <div className="border-2 border-dashed border-gray-800 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[160px] text-gray-600 hover:border-emerald-500/50 hover:text-emerald-500 transition-all cursor-pointer">
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase">Upload</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default VaultView;
