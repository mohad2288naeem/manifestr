/**
 * Represents a Tiptap Document Node
 * The root node of the document always has the type 'doc'.
 */
export interface TiptapDoc {
    type: "doc"
    content: TiptapNode[]
}

/**
 * Represents a generic Node in the Tiptap document tree.
 * Nodes can be top-level blocks like paragraphs, headings, lists,
 * or inline nodes like text.
 */
export type TiptapNode =
    | TiptapParagraph
    | TiptapHeading
    | TiptapText
    | TiptapBlockquote
    | TiptapCodeBlock
    | TiptapImage
    | TiptapBulletList
    | TiptapOrderedList
    | TiptapTaskList
    | TiptapListItem
    | TiptapTaskItem
    | TiptapHorizontalRule

/**
 * Common properties shared by all nodes
 */
interface BaseNode {
    /** The type of the node (e.g., 'paragraph', 'heading', 'text') */
    type: string
    /** Attributes associated with the node (e.g., alignment, level) */
    attrs?: Record<string, any>
    /** Inline marks applied to the node (e.g., bold, italic) - usually for text nodes */
    marks?: TiptapMark[]
}

/**
 * A Paragraph Node
 */
export interface TiptapParagraph extends BaseNode {
    type: "paragraph"
    attrs?: {
        /** Text alignment: 'left' | 'center' | 'right' | 'justify' */
        textAlign?: string | null
    }
    /** The inline content of the paragraph (text, hard breaks, etc.) */
    content?: TiptapNode[]
}

/**
 * A Heading Node
 */
export interface TiptapHeading extends BaseNode {
    type: "heading"
    attrs: {
        /** Heading level (1-6) */
        level: 1 | 2 | 3 | 4 | 5 | 6
        textAlign?: string | null
    }
    content?: TiptapNode[]
}

/**
 * A Text Node
 * Represents a string of text with optional formatting marks.
 */
export interface TiptapText extends BaseNode {
    type: "text"
    /** The actual text content */
    text: string
    /** Formatting marks like bold, italic, link, etc. */
    marks?: TiptapMark[]
}

/**
 * A Blockquote Node
 */
export interface TiptapBlockquote extends BaseNode {
    type: "blockquote"
    content: TiptapNode[]
}

/**
 * A Code Block Node
 */
export interface TiptapCodeBlock extends BaseNode {
    type: "codeBlock"
    attrs?: {
        /** Programming language for syntax highlighting */
        language?: string | null
    }
    content?: TiptapText[]
}

/**
 * An Image Node
 */
export interface TiptapImage extends BaseNode {
    type: "image"
    attrs: {
        /** URL of the image */
        src: string
        /** Alt text */
        alt?: string
        /** Title text */
        title?: string
    }
}

/**
 * A Bullet List Node
 */
export interface TiptapBulletList extends BaseNode {
    type: "bulletList"
    content: TiptapListItem[]
}

/**
 * An Ordered List Node
 */
export interface TiptapOrderedList extends BaseNode {
    type: "orderedList"
    attrs?: {
        /** Starting number for the list */
        start?: number
    }
    content: TiptapListItem[]
}

/**
 * A Task List Node (Checklist)
 */
export interface TiptapTaskList extends BaseNode {
    type: "taskList"
    content: TiptapTaskItem[]
}

/**
 * A specific item within a Bullet or Ordered list
 */
export interface TiptapListItem extends BaseNode {
    type: "listItem"
    content: TiptapNode[]
}

/**
 * A specific item within a Task list
 */
export interface TiptapTaskItem extends BaseNode {
    type: "taskItem"
    attrs: {
        /** Whether the item is checked */
        checked: boolean
    }
    content: TiptapNode[]
}

/**
 * A Horizontal Rule (Divider)
 */
export interface TiptapHorizontalRule extends BaseNode {
    type: "horizontalRule"
}

/**
 * Represents a Mark applied to a node (usually text)
 */
export type TiptapMark =
    | TiptapBoldMark
    | TiptapItalicMark
    | TiptapStrikeMark
    | TiptapUnderlineMark
    | TiptapCodeMark
    | TiptapLinkMark
    | TiptapHighlightMark
    | TiptapSuperscriptMark
    | TiptapSubscriptMark

export interface TiptapBoldMark {
    type: "bold"
}

export interface TiptapItalicMark {
    type: "italic"
}

export interface TiptapStrikeMark {
    type: "strike"
}

export interface TiptapUnderlineMark {
    type: "underline"
}

export interface TiptapCodeMark {
    type: "code"
}

export interface TiptapSuperscriptMark {
    type: "superscript"
}

export interface TiptapSubscriptMark {
    type: "subscript"
}

export interface TiptapLinkMark {
    type: "link"
    attrs: {
        href: string
        target?: string
        rel?: string
        class?: string | null
    }
}

export interface TiptapHighlightMark {
    type: "highlight"
    attrs?: {
        /** CSS color string or variable */
        color?: string
    }
}
