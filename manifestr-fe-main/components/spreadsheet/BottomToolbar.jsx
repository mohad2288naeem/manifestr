import React from 'react';
import {
    FileText,
    Sparkles,
    Database,
    Layout,
    Palette
} from 'lucide-react';

export default function BottomToolbar() {
    return (
        <div className="flex items-center gap-8 px-6 py-3 bg-gray-800 text-gray-400 text-sm">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Sparkles size={16} />
                AI Prompter
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText size={16} />
                File Templates
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Database size={16} />
                Data
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Palette size={16} />
                Style
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Layout size={16} />
                Page Layout
            </button>
        </div>
    );
}
