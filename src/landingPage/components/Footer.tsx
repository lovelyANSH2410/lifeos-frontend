import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-white/5 bg-[#020617]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">LifeOS</span>
                </div>

                <div className="flex gap-8 text-sm text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>

                <div className="text-slate-600 text-xs">
                    © 2024 LifeOS Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
