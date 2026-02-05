import { SimpleEditor } from '../tiptap-templates/simple/simple-editor';

export default function TiptapEditor({ onUpdate, content }) {
    return <SimpleEditor onUpdate={onUpdate} content={content} />
}
