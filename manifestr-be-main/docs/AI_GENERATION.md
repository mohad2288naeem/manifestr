# AI Generation API & Architecture

## Overview
The `manifestr-be` AI Controller provides a powerful, multi-agent generative system capable of creating complex content formats from simple natural language prompts. 

It supports three distinct output modes:
1. **Presentations**: Visually stunning, minimalist slide decks (Polotno/JSON).
2. **Documents**: Long-form, structured articles and reports (Tiptap/JSON).
3. **Spreadsheets**: Complex, multi-sheet workbooks with formulas and styles (Univer/JSON).

---

## API Reference

### 1. Start Generation
Initiates a new background generation job.

**Endpoint**: `POST /ai/generate`
**Auth**: Required (Bearer Token)

**Request Body**:
```json
{
  "prompt": "Pitch deck for a Series A FinTech startup focusing on AI payments",
  "output": "presentation", // "presentation" | "document" | "spreadsheet"
  "meta": {
    "tone": "Professional",
    "audience": "VCs",
    "brandColor": "#0055FF"
  },
  "style_guide_id": null
}
```

- `prompt`: The core instruction description.
- `output`: Target format. Defaults to "presentation".
- `meta`: Optional object for arbitrary user context (tone, audience, colors).
- `style_guide_id`: Optional ID of a saved style guide.

**Response**:
```json
{
  "status": "success",
  "message": "Generation Job Queued",
  "data": {
    "jobId": "uuid-string",
    "status": "QUEUED"
  }
}
```

### 2. Check Status
Poll this endpoint to track progress.

**Endpoint**: `GET /ai/status/:jobId`
**Auth**: Required

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "status": "PROCESSING_CONTENT", // QUEUED -> PROCESSING_INTENT -> ... -> COMPLETED
    "tokensUsed": 1500,
    "errorMessage": null
  }
}
```

### 3. Get Result / Details
Retrieves the final output and full job history.

**Endpoint**: `GET /ai/generation/:jobId`
**Auth**: Required

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "prompt": "...",
    "title": "PawMatch Investor Deck", // Generated Title
    "current_step_data": { 
       // Final Editor State (Polotno/Tiptap/Univer JSON)
    },
    "final_url": "s3://...",
    "status": "COMPLETED"
  }
}
```

---

## System Architecture: The 5-Agent Pipeline

The system uses an Autonomous Agent pipeline orchestrated via AWS SQS (FIFO) queues. Each step refines the output.

### 1. Intent Agent (`IntentAgent`)
- **Role**: Creative Director / Strategist.
- **Input**: User Prompt + Metadata.
- **Output**: Detailed Creative Brief (`IntentResponse`).
- **Logic**: 
  - Analyzes user intent, tone, audience.
  - Extracts design preferences (Dark Mode, Charts, Images).
  - Generates a `Structure Plan` (outline) and a `Title`.

### 2. Layout Agent (`LayoutAgent`)
- **Role**: Design System Architect.
- **Input**: `IntentResponse`.
- **Output**: Structural Blocks + Design System (`LayoutResponse`).
- **Logic**:
  - **Presentation**: Generates Slides with "Hero", "Split", "Grid" layouts.
  - **Document**: Generates Sections with "Article Header", "Text Column".
  - **Spreadsheet**: Generates a single "Workbook Container".
  - Defines **Color Palette** and **Typography** (Google Fonts pairings).

### 3. Content Agent (`ContentAgent`)
- **Role**: Copywriter / Data Expert.
- **Input**: `LayoutResponse`.
- **Output**: Final Content Payload (`ContentResponse`).
- **Logic**:
  - **Presentation**: Minimalist, punchy copy, visual impact.
  - **Document**: Long-form journalism (200+ words/section).
  - **Spreadsheet**: Generates COMPLETE Univer Workbook JSON (styles, sheets, formulas).
  - Generates Image Prompts (for Unsplash/Midjourney) and Chart Data (JSON).

### 4. Critic Agent (`CriticAgent`) [Planned]
- **Role**: Quality Assurance.
- **Action**: Reviews content against constraints. (Pass-through in MVP).

### 5. Rendering Agent (`RenderingAgent`)
- **Role**: Engine / Assembler.
- **Input**: `ContentResponse`.
- **Output**: Final Editor State (`RenderResponse`).
- **Logic**:
  - **Polotno**: Maps layouts to canvas (x, y coordinates), calculates text heights, renders Charts via QuickChart.io, fetches Unsplash images.
  - **Tiptap**: Converts blocks to HTML/ProseMirror nodes.
  - **Univer**: Injects the workbook JSON directly or builds it from rows.
  - Handles **Dark Mode** logic (auto-detects background luminance).

---

## Key Features

### Dark Mode & Aesthetics
- The system automatically detects "Dark Mode" requests.
- `RenderingAgent` calculates background luminance and flips text color to White/Light Gray accordingly.
- `LayoutAgent` prioritizes aesthetic layouts (Hero, Minimal) over dense text.

### Chart Generation
- Charts are generated as real data visualizations.
- If data generation fails, the system gracefully falls back to a clean text insight card, avoiding broken visuals.
- Supported Chart Types: Bar, Line, Doughnut.

### Typography
- The system selects from a curated list of Premium Google Fonts (e.g., Inter, Playfair Display, Space Grotesk, Monserrat).
- Font selections are embedded in the final design system schema.
