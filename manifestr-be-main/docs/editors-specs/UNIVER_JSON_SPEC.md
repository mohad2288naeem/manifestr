# Univer Spreadsheet JSON Specification

This document details the JSON structure used by the Univer Spreadsheet Editor in the Manifestr application.

## Root Structure (`IWorkbookData`)

The workbook is the top-level container holding all sheets, styles, and configuration.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the workbook. |
| `name` | `string` | Display name of the file. |
| `sheetOrder` | `string[]` | Array of sheet IDs defining the tab order. |
| `styles` | `object` | A map registry of style definitions referenced by ID. |
| `sheets` | `object` | A map of sheet objects, keyed by their ID. |

## Sheet Structure (`IWorksheetData`)

Represents a single tab within the spreadsheet.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., "sheet-01"). |
| `name` | `string` | the name displayed on the tab. |
| `cellData` | `object` | The sparse matrix of cell data. |
| `rowCount` | `number` | Total rows in the grid. |
| `columnCount` | `number` | Total columns in the grid. |
| `mergeData` | `array` | List of merged cell ranges. |
| `freeze` | `object` | Configuration for frozen rows/cols. |

### Cell Data (`ICellData`)

Cell data is stored as a sparse matrix: `{ [rowIndex]: { [colIndex]: cellObject } }`.

**Key Fields:**
*   `v`: **Value**. The raw value (string, number, boolean).
*   `f`: **Formula**. String starting with `=` (e.g., `=SUM(A1:B1)`).
*   `s`: **Style**. Can be a string ID referencing `styles` map OR an inline style object.
*   `t`: **Type**. `1`=String, `2`=Number, `3`=Boolean.

### Styles (`IStyleData`)

Styles define the visual appearance of cells.

| Field | Description | Example |
| :--- | :--- | :--- |
| `fs` | Font Size | `12` |
| `ff` | Font Family | `"Arial"` |
| `bl` | Bold | `1` (true) / `0` (false) |
| `it` | Italic | `1` / `0` |
| `cl` | Text Color | `{ rgb: "#ff0000" }` |
| `bg` | Background | `{ rgb: "#fafafa" }` |
| `ht` | Horizontal Align | `1` (Left), `2` (Center), `3` (Right) |
| `vt` | Vertical Align | `1` (Top), `2` (Middle), `3` (Bottom) |
| `n` | Number Format | `{ pattern: "$#,##0.00" }` |

## Example

```json
{
  "id": "workbook-1",
  "styles": {
    "style-header": {
      "bl": 1,
      "bg": { "rgb": "#cccccc" }
    }
  },
  "sheets": {
    "sheet-1": {
      "name": "Sheet1",
      "cellData": {
        "0": {
          "0": { "v": "Total", "s": "style-header" },
          "1": { "v": 100, "t": 2, "f": "=SUM(A2:A10)" }
        }
      }
    }
  }
}
```
