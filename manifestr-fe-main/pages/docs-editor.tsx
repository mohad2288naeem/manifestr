import React, { useState } from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
import TiptapEditor from '../components/docs/TiptapEditor';
import DocumentOutline from '../components/docs/DocumentOutline';
import RightSidebar from '../components/spreadsheet/RightSidebar';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import { FloatingFAB } from '../components/spreadsheet/FloatingElements';

import docsContent from '../assets/dummy/docs-content.json';
import useGenerationLoader from '../hooks/useGenerationLoader';
import GenerationLoaderUI from '../components/shared/GenerationLoaderUI';

export default function DocsEditor() {
    const [headings, setHeadings] = useState([]);
    const { loading, error, status, content } = useGenerationLoader();

    const extractHeadings = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        const extractedHeadings = Array.from(headingElements).map((el, index) => ({
            id: `heading-${index}`,
            level: parseInt(el.tagName.substring(1)),
            text: el.textContent || '',
        }));

        setHeadings(extractedHeadings);
    };

    // Use generated content if available, otherwise fall back to dummy
    // Note: TiptapEditor expects 'content' prop. 
    // If 'content' from hook is JSON/HTML, we pass it.
    const editorContent = content || docsContent;

    return (
        <GenerationLoaderUI loading={loading} status={status} error={error}>
            <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
                <Head>
                    <title>Docs Editor | Manifestr</title>
                </Head>

                {/* Top Section */}
                <div className="flex-none z-30">
                    <TopHeader />
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex relative overflow-hidden">
                    {/* Left Sidebar - Document Outline */}
                    <div className="hidden md:block h-full">
                        <DocumentOutline headings={headings} />
                    </div>

                    {/* Editor Container */}
                    <div className="flex-grow relative">
                        <TiptapEditor onUpdate={extractHeadings} content={editorContent} />
                    </div>

                    {/* Right Sidebar (Floating over editor on the right) */}
                    <div className="hidden md:flex absolute right-[-12px] top-0 bottom-0 items-center z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <RightSidebar />
                        </div>
                    </div>

                    {/* Floating FAB */}
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
