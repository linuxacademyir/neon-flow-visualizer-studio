# Vaza Flow Server

Backend server for storing and managing Vaza Flow workflows.

## Features

- **Server-side Storage**: Workflows are stored in `/server/workflows/` directory
- **RESTful API**: CRUD operations for workflow management
- **Auto-generated Directory**: Creates workflow storage directory automatically
- **CORS Enabled**: Allows frontend to communicate with the server

## Directory Structure

```
server/
├── workflows/           # Auto-created directory for workflow files
│   ├── my-workflow.json
│   ├── payment-process.json
│   └── user-registration.json
├── index.js            # Express server
├── package.json        # Server dependencies
└── README.md          # This file
```

## API Endpoints

### GET /api/workflows
Returns list of all available workflows.

**Response:**
```json
{
  "workflows": ["my-workflow", "payment-process", "user-registration"]
}
```

### GET /api/workflows/:name
Get a specific workflow by name.

**Response:**
```json
{
  "name": "my-workflow",
  "nodes": [...],
  "edges": [...],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

### POST /api/workflows
Create or update a workflow.

**Request Body:**
```json
{
  "name": "my-workflow",
  "nodes": [...],
  "edges": [...]
}
```

### PUT /api/workflows/:name
Update an existing workflow.

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

### DELETE /api/workflows/:name
Delete a workflow.

### GET /api/health
Health check endpoint.

## Running the Server

### Development
```bash
cd server
npm install
npm run dev
```

### Production
```bash
cd server
npm install
npm start
```

## Environment

- **Development**: Server runs on `http://localhost:3001`
- **Production**: Uses environment PORT or defaults to 3001

## File Storage

Workflows are stored as JSON files in the `server/workflows/` directory:

- **File naming**: Workflow names are sanitized (spaces → hyphens, lowercase)
- **File format**: Standard JSON with workflow data
- **Auto-backup**: Files can be manually backed up, version controlled, etc.

Example workflow file (`server/workflows/my-workflow.json`):
```json
{
  "name": "My Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "position": {"x": 100, "y": 100},
      "data": {
        "label": "Email Trigger",
        "branchConfigs": [
          {
            "branch": 1,
            "name": "Primary Route",
            "description": "Main processing path",
            "priority": 1,
            "conditions": [{"type": "always"}],
            "operators": []
          }
        ]
      }
    }
  ],
  "edges": [...],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

## Benefits

✅ **No User Permissions**: No browser directory permissions required  
✅ **Centralized Storage**: All workflows in one server location  
✅ **Easy Backup**: Standard files that can be backed up/versioned  
✅ **Multi-User Ready**: Server can handle multiple users (future enhancement)  
✅ **Cross-Platform**: Works on any system that runs Node.js 