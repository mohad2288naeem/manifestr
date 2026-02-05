import React, { useRef, useState } from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
// import FormulaBar from '../components/spreadsheet/FormulaBar';
import UniverSheet from '../components/spreadsheet/UniverSheet';
import RightSidebar from '../components/spreadsheet/RightSidebar';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import { FloatingSheetTab, FloatingFAB } from '../components/spreadsheet/FloatingElements';

import spreadsheetData from '../assets/dummy/spreadsheet-data.json';
import useGenerationLoader from '../hooks/useGenerationLoader';
import GenerationLoaderUI from '../components/shared/GenerationLoaderUI';

export default function SpreadsheetEditor() {
    const univerRef = useRef(null);
    const [univerAPI, setUniverAPI] = useState(null);
    const { loading, error, status, content } = useGenerationLoader();

    const data = content || spreadsheetData;

    return (
        <GenerationLoaderUI loading={loading} status={status} error={error}>
            <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
                <Head>
                    <title>Spreadsheet Editor | Manifestr</title>
                </Head>

                {/* Top Section */}
                <div className="flex-none z-30">
                    <TopHeader />
                    {/* Using Univer's native formula bar instead */}
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex relative overflow-hidden bg-gray-100 p-8">
                    {/* Grid Container (Card) */}
                    <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden relative z-10">
                        <UniverSheet ref={univerRef} onAPIReady={setUniverAPI} data={data} />
                    </div>

                    {/* Right Sidebar (Floating over grid on the right) */}
                    <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <RightSidebar />
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <FloatingSheetTab />
                    <FloatingFAB />
                </div>

                {/* Bottom Section */}
                <div className="flex-none z-30">
                    <BottomToolbar />
                </div>
            </div>
        </GenerationLoaderUI>
    );
}
