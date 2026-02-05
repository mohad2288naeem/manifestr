/**
 * Represents the root data structure for the Univer Spreadsheet.
 * Based on IWorkbookData from @univerjs/presets
 */
export interface UniverWorkbookData {
    /** Unique ID for the workbook */
    id: string
    /** Locale of the workbook (e.g., 'en-US') */
    locale: string
    /** Name of the workbook */
    name: string
    /** Ordered list of sheet IDs */
    sheetOrder: string[]
    /** Application version */
    appVersion: string
    /** Map of named styles used in the workbook */
    styles: Record<string, UniverStyle>
    /** Map of sheets in the workbook */
    sheets: Record<string, UniverSheet>
}

/**
 * Represents a single worksheet within the workbook.
 */
export interface UniverSheet {
    /** Display name of the sheet */
    name: string
    /** Unique ID of the sheet (must match key in sheets map) */
    id: string
    /** Tab color in hex format */
    tabColor?: string
    /** Initial number of rows */
    rowCount: number
    /** Initial number of columns */
    columnCount: number
    /** Frozen row/column configuration */
    freeze?: UniverFreezeConfig
    /** Scroll position top */
    scrollTop?: number
    /** Scroll position left */
    scrollLeft?: number
    /** Default width for columns */
    defaultColumnWidth?: number
    /** Default height for rows */
    defaultRowHeight?: number
    /** Merged cell ranges */
    mergeData?: UniverMergeConfig[]
    /** Content of the cells, indexed by row then column */
    cellData: Record<number, Record<number, UniverCell>>
    /** Column specific settings */
    columnData?: Record<number, UniverColumnData>
    /** Row specific settings */
    rowData?: Record<number, UniverRowData>
}

/**
 * Configuration for freezing rows/columns
 */
export interface UniverFreezeConfig {
    /** Horizontal split position */
    xSplit?: number
    /** Vertical split position */
    ySplit?: number
    /** Row index to start freezing from */
    startRow?: number
    /** Column index to start freezing from */
    startColumn?: number
}

/**
 * Configuration for merging cells
 */
export interface UniverMergeConfig {
    startRow: number
    endRow: number
    startColumn: number
    endColumn: number
}

/**
 * Define styles for a cell
 */
export interface UniverStyle {
    /** Font family */
    ff?: string
    /** Font size in pts */
    fs?: number
    /** Italic: 1 for true, 0 for false */
    it?: 0 | 1
    /** Bold: 1 for true, 0 for false */
    bl?: 0 | 1
    /** Underline */
    ul?: { s: 0 | 1 }
    /** Strikethrough */
    st?: { s: 0 | 1 }
    /** Overline */
    ol?: { s: 0 | 1 }
    /** Background color */
    bg?: { rgb: string }
    /** Text color */
    cl?: { rgb: string }
    /** Horizontal alignment: 1: left, 2: center, 3: right */
    ht?: 1 | 2 | 3
    /** Vertical alignment: 1: top, 2: center, 3: bottom */
    vt?: 1 | 2 | 3
    /** Number formatting */
    n?: { pattern: string }
    /** Borders */
    bd?: {
        t?: UniverBorder
        b?: UniverBorder
        l?: UniverBorder
        r?: UniverBorder
    }
}

/**
 * Border style configuration
 */
export interface UniverBorder {
    /** Style type enum */
    s: number
    /** Color in rgb format */
    cl: { rgb: string }
}

/**
 * Column meta data
 */
export interface UniverColumnData {
    /** Width of the column */
    w?: number
    /** Hidden status */
    hd?: 0 | 1
}

/**
 * Row meta data
 */
export interface UniverRowData {
    /** Height of the row */
    h?: number
    /** Hidden status */
    hd?: 0 | 1
}

/**
 * Represents a single cell's data
 */
export interface UniverCell {
    /** Value of the cell (string, number, boolean) */
    v?: string | number | boolean
    /** Formula string (start with =) */
    f?: string
    /** Style ID (referencing key in workbook.styles) or inline style object */
    s?: string | UniverStyle
    /** Cell type: 1: string, 2: number, 3: boolean */
    t?: 1 | 2 | 3
}
