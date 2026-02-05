/**
 * Represents a complete Polotno Project
 */
export interface PolotnoProject {
    /** Schema version for compatibility */
    schemaVersion: number
    /** Global width of the canvas/page in pixels */
    width: number
    /** Global height of the canvas/page in pixels */
    height: number
    /** Unit of measurement */
    unit: "px" | "mm" | "cm" | "in"
    /** Dots per inch */
    dpi: number
    /** List of custom fonts used in the project */
    fonts: any[]
    /** List of audio assets */
    audios: any[]
    /** Array of pages in the presentation */
    pages: PolotnoPage[]
}

/**
 * Represents a single Page/Slide in the project
 */
export interface PolotnoPage {
    /** Unique identifier for the page */
    id: string
    /** Background color or configuration */
    background: string
    /** Array of visual elements on the page (z-indexed by order) */
    children: PolotnoElement[]
    /** Optional custom bleed setting */
    bleed?: number
}

/**
 * Common properties for all Polotno Elements
 */
export interface BasePolotnoElement {
    /** Unique ID for the element */
    id: string
    /** Type of the element */
    type: "text" | "image" | "figure" | "svg" | "group"
    /** X position */
    x: number
    /** Y position */
    y: number
    /** Width */
    width: number
    /** Height */
    height: number
    /** Rotation in degrees */
    rotation?: number
    /** Opacity (0-1) */
    opacity?: number
    /** Whether the element is locked */
    locked?: boolean
    /** Whether the aspect ratio is locked */
    alwaysKeepRatio?: boolean
    /** Custom name for the layer */
    name?: string
}

/**
 * Text Element
 */
export interface PolotnoTextElement extends BasePolotnoElement {
    type: "text"
    /** Text content */
    text: string
    /** Font size in pixels */
    fontSize: number
    /** Font family name */
    fontFamily: string
    /** Text color (hex, rgb, rgba) */
    fill: string
    /** Text alignment */
    align?: "left" | "center" | "right" | "justify"
    /** Vertical alignment used mostly for placeholders */
    verticalAlign?: "top" | "middle" | "bottom"
    /** Font style */
    fontStyle?: "normal" | "italic"
    /** Font weight */
    fontWeight?: "normal" | "bold" | string
    /** Text decoration */
    textDecoration?: "none" | "underline" | "line-through"
    /** Line height/Leading */
    lineHeight?: number
    /** Letter spacing/Tracking */
    letterSpacing?: number
    /** Stroke/Outline color */
    stroke?: string
    /** Stroke width */
    strokeWidth?: number
    /** Enable auto-resizing based on content */
    widthAutoResize?: boolean
}

/**
 * Image Element
 */
export interface PolotnoImageElement extends BasePolotnoElement {
    type: "image"
    /** Source URL of the image */
    src: string
    /** Cropping configuration */
    cropX?: number
    cropY?: number
    cropWidth?: number
    cropHeight?: number
    /** Filter effects */
    blur?: number
    brightness?: number
    contrast?: number
    grayscale?: number
    sepia?: number
    hueRotation?: number
}

/**
 * Figure/Shape Element
 */
export interface PolotnoFigureElement extends BasePolotnoElement {
    type: "figure"
    /** Sub-type of figure (e.g., rect, circle, triangle) */
    subType: "rect" | "circle" | "triangle" | "line" | "star" | string
    /** Fill color */
    fill: string
    /** Stroke/Border color */
    stroke?: string
    /** Stroke/Border width */
    strokeWidth?: number
    /** Corner radius for rectangles */
    cornerRadius?: number
}

/**
 * Union type for all supported elements
 */
export type PolotnoElement =
    | PolotnoTextElement
    | PolotnoImageElement
    | PolotnoFigureElement
