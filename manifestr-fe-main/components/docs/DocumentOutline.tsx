import React from 'react';
import { FileText } from 'lucide-react';

export default function DocumentOutline({ headings }) {
    const scrollToHeading = (id) => {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <FileText size={18} className="text-gray-600" />
                <h3 className="font-semibold text-gray-900">Outline</h3>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
                {headings && headings.length > 0 ? (
                    <div className="space-y-1">
                        {headings.map((heading, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToHeading(heading.id)}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors text-sm ${heading.level === 1
                                        ? 'font-semibold text-gray-900'
                                        : heading.level === 2
                                            ? 'font-medium text-gray-700 pl-6'
                                            : 'text-gray-600 pl-9'
                                    }`}
                                style={{
                                    paddingLeft: `${(heading.level - 1) * 12 + 12}px`,
                                }}
                            >
                                {heading.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 text-sm mt-8">
                        <p>No headings yet</p>
                        <p className="mt-2 text-xs">Add headings to see document outline</p>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                    <p>{headings ? headings.length : 0} headings</p>
                </div>
            </div>
        </div>
    );
}
