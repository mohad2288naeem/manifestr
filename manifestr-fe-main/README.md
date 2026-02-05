# Manifestr Frontend

Manifestr is a powerful, comprehensive creative suite and collaboration platform built with Next.js. It integrates multiple specialized editors for documents, spreadsheets, presentations, images, videos, and charts into a unified interface, along with project management and collaboration tools.

## 🚀 Features

### Creative Suite Editors
This project integrates several advanced editing capabilities:
- **Rich Text Editor**: Powered by [Tiptap](https://tiptap.dev/), offering a Notion-like editing experience (`/docs-editor`).
- **Spreadsheet Editor**: Built with [Univer](https://univer.ai/), providing Excel-like functionality (`/spreadsheet-editor`).
- **Presentation Editor**: Utilizes [IMG.LY's CreativeEditor SDK](https://img.ly/docs/cesdk/) for creating slide decks (`/presentation-editor`).
- **Image Editor**: Integrated with [IMG.LY's PhotoEditor SDK](https://img.ly/photo-sdk) for professional photo editing (`/image-editor`).
- **Video Editor**: Also leverages [IMG.LY's CreativeEditor SDK](https://img.ly/docs/cesdk/) for video timeline editing (`/video-editor`).
- **Chart Editor**: Features [Highcharts](https://www.highcharts.com/) for creating and customizing data visualizations (`/chart-editor`).

### Core Platform
- **Authentication**: Complete flow with Login, Signup, Forgot Password, and Onboarding (`/login`, `/signup`, `/onboarding`).
- **Project Structure**: Create and manage Projects and Style Guides (`/create-project`, `/style-guide`).
- **Vault**: Asset management system (`/vault`).
- **Toolkit**: Resource and tool library (`/toolkit`).
- **Collaboration**: Real-time collaboration features (Collab Hub).
- **Hologram AI**: Interactive 3D AI assistant powered by [Three.js](https://threejs.org/).

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Pages Router)
- **UI Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & React Icons

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd manifestr-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
manifestr-fe/
├── components/          # Reusable UI components and feature-specific components
│   ├── editor/          # Shared editor components
│   ├── spreadsheet/     # Spreadsheet-specific logic
│   ├── presentation-editor/ # Presentation editor resources
│   └── ui/              # Generic UI components (Buttons, Cards, etc.)
├── lib/
│   └── design-system/   # Design tokens and constants
├── pages/               # Application routes
│   ├── docs-editor.tsx
│   ├── spreadsheet-editor.tsx
│   ├── video-editor.tsx
│   └── ...
├── public/              # Static assets
└── styles/              # Global styles
```

## 🎨 Design System

The project follows a strict design system defined in `DESIGN_SYSTEM.md`.
- **Tokens**: Colors, typography, and spacing are centralized in `lib/design-system`.
- **Tailwind**: Configured to use these tokens for consistent styling.

For more details, check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).
