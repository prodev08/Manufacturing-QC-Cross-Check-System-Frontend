# Manufacturing QC Cross-Check System - Frontend

Modern React dashboard for the Manufacturing QC Cross-Check System.

## Features

- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Drag & Drop**: Intuitive file upload interface
- **Real-time Updates**: Live progress tracking and status updates
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Start development server:
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FileUpload.tsx  # Drag & drop file upload
│   └── Layout.tsx      # Main layout wrapper
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── SessionDetails.tsx
│   └── SessionHistory.tsx
├── stores/             # Zustand state stores
│   └── sessionStore.ts # Session management
├── lib/                # Utilities and API
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
├── types/              # TypeScript type definitions
│   └── api.ts         # API response types
└── main.tsx           # Application entry point
```

## Current Status

- ✅ React TypeScript setup with Vite
- ✅ Tailwind CSS configuration
- ✅ File upload interface with drag & drop
- ✅ Basic routing and layout
- ✅ API client and type definitions
- ✅ State management with Zustand
- ⏳ Session details page (next step)
- ⏳ Validation results display
- ⏳ Real-time progress tracking

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000` by default. All API calls are typed and include:

- Session management
- File upload and management
- Processing status monitoring
- Validation results retrieval
- Complete workflow orchestration
