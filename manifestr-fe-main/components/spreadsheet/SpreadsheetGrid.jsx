import React from 'react';

export default function SpreadsheetGrid() {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const rows = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="flex-grow overflow-auto bg-white relative">
            <div className="inline-block min-w-full">
                {/* Header Row */}
                <div className="flex sticky top-0 z-10">
                    {/* Corner Cell */}
                    <div className="w-10 h-8 bg-gray-100 border-r border-b border-gray-300 flex-shrink-0 sticky left-0 z-20"></div>

                    {/* Column Headers */}
                    {cols.map((col) => (
                        <div
                            key={col}
                            className="w-24 h-8 bg-gray-50 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0"
                        >
                            {col}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {rows.map((row) => (
                    <div key={row} className="flex">
                        {/* Row Header */}
                        <div className="w-10 h-6 bg-gray-50 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 sticky left-0 z-10">
                            {row}
                        </div>

                        {/* Cells */}
                        {cols.map((col) => (
                            <div
                                key={`${col}${row}`}
                                className="w-24 h-6 border-r border-b border-gray-200 bg-white flex-shrink-0"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
