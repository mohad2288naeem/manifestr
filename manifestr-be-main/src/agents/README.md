# AI Agent Architecture

This directory contains the autonomous agents for the Manifestr AI Generation Pipeline.

## Architecture
The system uses a **Linear Chain of Responsibility** pattern, decoupled by SQS Queues.

1. **Orchestrator** (API): Receives request -> Creates Job (DB) -> Pushes to `IntentQueue`.
2. **Intent Agent**: Reads `IntentQueue` -> Analyzes Prompt -> Pushes to `LayoutQueue`.
3. **Layout Agent**: Reads `LayoutQueue` -> Designs Structure -> Pushes to `ContentQueue`.
4. **Content Agent**: Reads `ContentQueue` -> Writes Text -> Pushes to `RenderQueue`.
5. **Rendering Agent**: Reads `RenderQueue` -> Generates Editor JSON -> Marks Job Completed.

## Directory Structure
- `core/`: Base class for SQS polling and Job state management.
- `protocols/`: Zod schemas defining the strict input/output contracts.
- `intent/`: Agent responsible for understanding user goals.
- `layout/`: Agent responsible for structural design (Slides, Sections).
- `content/`: Agent responsible for copywriting and data generation.
- `rendering/`: Agent responsible for mapping content to Polotno/Tiptap/Univer formats.

## How to Run

### 1. Prerequisites
Ensure your `.env` has:
```bash
OPENAI_API_KEY=sk-...
AWS_REGION=us-east-1
SQS_QUEUE_INTENT_URL=https://sqs.us-east-1.amazonaws.com/...
SQS_QUEUE_LAYOUT_URL=...
SQS_QUEUE_CONTENT_URL=...
SQS_QUEUE_RENDER_URL=...
```

### 2. Start the Agents
Run the worker process that listens to all queues:
```bash
npx ts-node src/scripts/run-agents.ts
```

### 3. Start the API
Run the main Express API to handle user requests:
```bash
pnpm start:dev
```
