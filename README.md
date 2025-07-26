# Vaza Flow - Workflow Builder

A powerful, visual workflow builder with server-side storage for creating and managing complex automation workflows.

## 🌟 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows
- **Server Storage**: Workflows automatically saved to server (no permissions needed)
- **Router Branches**: Configure multiple execution paths with conditions
- **Real-time Editing**: Auto-save functionality with 1-second debouncing
- **Import/Export**: JSON format for workflow backup and sharing

## 🚀 Quick Start

### Method 1: Run Everything Together (Recommended)
```bash
# Install all dependencies (frontend + backend)
npm install

# Start both frontend and backend servers
npm run start:full
```

### Method 2: Run Separately
```bash
# Terminal 1: Start the backend server
npm run server:dev

# Terminal 2: Start the frontend
npm run dev
```

## 📁 Project Structure

```
vaza-flow/
├── src/                 # Frontend React application
├── server/             # Backend Express server
│   ├── workflows/      # Auto-created workflow storage
│   ├── index.js       # Server entry point
│   └── package.json   # Server dependencies
├── package.json       # Frontend dependencies & scripts
└── README.md         # This file
```

## 💾 Workflow Storage

Workflows are automatically stored on the server in `server/workflows/` as JSON files:

- **Location**: `server/workflows/my-workflow.json`
- **Format**: Standard JSON with nodes, edges, and metadata
- **Auto-save**: Changes saved automatically after 1 second of inactivity
- **No Permissions**: No browser file system permissions required

## 🔧 Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies (this will also install server dependencies)
npm install

# Start both frontend and backend
npm run start:full
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server:dev` - Start backend development server  
- `npm run start:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run server` - Start backend in production mode

### Ports

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🎯 Usage

1. **Create Workflows**: Use the visual builder to drag and drop nodes
2. **Configure Branches**: For router nodes, set up multiple execution paths
3. **Auto-Save**: Workflows are automatically saved as you work
4. **Load/Switch**: Use the dropdown to switch between saved workflows
5. **Export/Import**: Download workflows as JSON files for backup

## 🔧 Router Branch Configuration

The router node supports complex branching logic:

- **Multiple Branches**: Configure 2-10 output branches
- **Branch Names**: Give each branch a descriptive name
- **Conditions**: Set execution conditions (always, expressions, cooldowns)
- **Priorities**: Control execution order
- **Isolated Storage**: Each branch configuration is stored independently

## 🛠️ API Endpoints

The server provides a RESTful API for workflow management:

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:name` - Get specific workflow  
- `POST /api/workflows` - Create/update workflow
- `DELETE /api/workflows/:name` - Delete workflow
- `GET /api/health` - Server health check

## 🚀 Deployment

### Frontend
Build and deploy the frontend to any static hosting service:

```bash
npm run build
# Deploy the `dist` folder
```

### Backend
Deploy the Express server to any Node.js hosting service:

```bash
cd server
npm install --production
npm start
```

## 🔧 Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Flow
- **Backend**: Node.js, Express.js, File System
- **Storage**: JSON files on server filesystem

## 📝 License

MIT License - feel free to use this project as you see fit!
