import React from 'react';
import { MessageSquare, Share2, Star, History, ZoomIn, ZoomOut } from 'lucide-react';

export default function RightSidebar() {
    return (
        <div className="w-14 bg-gray-800 flex flex-col items-center py-4 gap-6 rounded-l-2xl shadow-lg my-auto h-fit mr-2">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Star size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <History size={20} />
            </button>
            <div className="w-8 h-px bg-gray-700"></div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ZoomIn size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ZoomOut size={20} />
            </button>
        </div>
    );
}
