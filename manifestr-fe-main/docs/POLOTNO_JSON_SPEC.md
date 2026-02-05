# Polotno JSON Specification

This document details the JSON structure used by the Polotno Presentation Editor.

## Root Structure (`PolotnoProject`)

The root object defines the canvas dimensions and contains the pages.

| Property | Type | Description |
| :--- | :--- | :--- |
| `width` | `number` | Width of the slide in pixels (e.g., 1920). |
| `height` | `number` | Height of the slide in pixels (e.g., 1080). |
| `pages` | `array` | Array of Page objects. |
| `fonts` | `array` | List of custom fonts used in the project. |

## Page Structure

A page represents a single slide.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier. |
| `background` | `string` | Hex color code or gradient string. |
| `children` | `array` | List of Element objects on this page (z-index order). |

## Elements

All visual items on a page are **Elements**.

### Common Properties

All elements share these fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID. |
| `type` | `string` | "text", "image", "figure". |
| `x` | `number` | Horizontal position (left is 0). |
| `y` | `number` | Vertical position (top is 0). |
| `width` | `number` | Width in pixels. |
| `height` | `number` | Height in pixels. |
| `rotation` | `number` | Rotation in degrees. |

### Text Element (`type: "text"`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `text` | `string` | The content string. |
| `fontSize` | `number` | Size in pixels. |
| `fontFamily` | `string` | Font family name. |
| `fill` | `string` | Text color (hex). |
| `align` | `string` | "left", "center", "right". |

### Image Element (`type: "image"`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `src` | `string` | Web URL to the image resource. |
| `cropX` / `cropY` | `number` | Crop viewport coordinates. |

### Figure Element (`type: "figure"`)

Used for shapes and solid overlays.

| Field | Type | Description |
| :--- | :--- | :--- |
| `subType` | `string` | "rect", "circle", "line". |
| `fill` | `string` | Fill color (hex or rgba). |
| `stroke` | `string` | Border color. |

## Example

```json
{
  "width": 1920,
  "height": 1080,
  "pages": [
    {
      "id": "page-1",
      "background": "#ffffff",
      "children": [
        {
          "id": "text-1",
          "type": "text",
          "x": 100,
          "y": 100,
          "width": 500,
          "height": 60,
          "text": "Hello World",
          "fontSize": 40,
          "fontFamily": "Roboto",
          "fill": "black"
        }
      ]
    }
  ]
}
```
