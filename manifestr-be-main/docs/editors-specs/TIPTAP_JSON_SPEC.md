# Tiptap JSON Specification

This document details the JSON structure used by the Tiptap rich text editor in the Manifestr application.

## Root Structure

The document follows a hierarchical tree structure commonly known as "ProseMirror JSON".

```typescript
interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}
```

## Nodes

Every element in the document is a **Node**. Nodes can contain other nodes (e.g., a `doc` contains `paragraph`s, a `bulletList` contains `listItem`s).

### Common Properties

All nodes share these base properties:

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | `string` | The distinct type identifier (e.g., "paragraph", "text"). |
| `attrs` | `object` | Optional key-value pairs storing node-specific attributes (e.g., heading level, image src). |
| `content` | `array` | Optional list of child nodes. |
| `marks` | `array` | Optional list of marks applied to the node (typically used on "text" nodes). |

### Supported Node Types

#### `paragraph`
Standard text block.
*   **Attributes**:
    *   `textAlign`: "left" | "center" | "right" | "justify"

#### `heading`
Headings h1-h6.
*   **Attributes**:
    *   `level`: number (1-6)
    *   `textAlign`: "left" | "center" | "right" | "justify"

#### `text`
The leaf node containing actual text content.
*   **Properties**:
    *   `text`: string (The actual text content)
*   **Note**: Formatting like bold/italic is applied via the `marks` array, not as attributes.

#### `image`
Embedded image.
*   **Attributes**:
    *   `src`: string (URL)
    *   `alt`: string
    *   `title`: string

#### `bulletList` / `orderedList`
Lists containers.
*   **Content**: Must contain `listItem` nodes.
*   **Attributes** (`orderedList` only):
    *   `start`: number (Starting index)

#### `taskList`
Container for checklists.
*   **Content**: Must contain `taskItem` nodes.

#### `taskItem`
Individual item in a task list.
*   **Attributes**:
    *   `checked`: boolean (true/false)

#### `codeBlock`
Code snippet block.
*   **Attributes**:
    *   `language`: string (e.g., "javascript", "python")

#### `horizontalRule`
A visual divider line.

#### `blockquote`
A quoted section.

## Marks

Marks add formatting to `text` nodes. They are stord in the `marks` array of a node.

### Supported Mark Types

| Type | Attributes | Description |
| :--- | :--- | :--- |
| `bold` | - | Bold text weight |
| `italic` | - | Italic text style |
| `strike` | - | Strikethrough |
| `underline` | - | Underlined text |
| `code` | - | Inline code (monospaced) |
| `superscript` | - | Superscript text |
| `subscript` | - | Subscript text |
| `highlight` | `color`: string | Text highlight background color |
| `link` | `href`: string<br>`target`: string | Hyperlink |

## Example

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [
        { "type": "text", "text": "Hello World" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "This is bold.",
          "marks": [{ "type": "bold" }]
        }
      ]
    }
  ]
}
```
