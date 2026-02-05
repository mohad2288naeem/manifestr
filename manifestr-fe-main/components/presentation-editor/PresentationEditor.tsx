import React, { useState } from 'react';
import { createStore } from 'polotno/model/store';
import { Workspace } from 'polotno/canvas/workspace';
import { SidePanel } from 'polotno/side-panel';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { PagesTimeline } from 'polotno/pages-timeline';
import { observer } from 'mobx-react-lite';
import { Button } from '@blueprintjs/core';
import presentationData from '../../assets/dummy/presentation-data.json';

const EditorUI = observer(({ store }: { store: any }) => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-auto">
                <Toolbar store={store} />
            </div>
            <div className="flex flex-row h-full w-full overflow-hidden">
                <div className="flex-none h-full" style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
                    <SidePanel store={store} />
                </div>
                <div className="flex-grow h-full relative relative-app-workspace bg-gray-100 flex flex-col">
                    <Workspace store={store} />
                    <ZoomButtons store={store} />
                    <div className="absolute top-4 right-20 z-10">
                        <Button
                            className="!bg-gray-900 !text-white !border-none hover:!bg-gray-800"
                            onClick={() => {
                                store.saveAsPDF({ fileName: 'presentation.pdf' });
                            }}
                        >
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>
            {/* Pages Timeline at the bottom for multi-page presentation */}
            <div className="h-auto bg-white border-t border-gray-200">
                <PagesTimeline store={store} />
            </div>
        </div>
    );
});

export default function PresentationEditor({ data }: { data?: any }) {
    const [store] = useState(() => {
        const s = createStore({
            key: 'ftRB7anj9zd88zwAlJKy',
            showCredit: false
        });

        // Ensure at least one page exists
        // Load passed data or fallback to dummy
        try {
            s.loadJSON(data || presentationData);
        } catch (e) {
            console.error("Failed to load presentation JSON", e);
            // Fallback to empty page if corrupted
            s.addPage();
        }

        return s;
    });

    return (
        <div className="w-full h-full bg-white relative">
            <EditorUI store={store} />
        </div>
    );
}
