const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create workflows directory if it doesn't exist
const WORKFLOWS_DIR = path.join(__dirname, 'workflows');

async function ensureWorkflowsDir() {
  try {
    await fs.access(WORKFLOWS_DIR);
  } catch {
    await fs.mkdir(WORKFLOWS_DIR, { recursive: true });
    console.log('Created workflows directory:', WORKFLOWS_DIR);
  }
}

// Initialize
ensureWorkflowsDir();

// Utility function to sanitize filename
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// Routes

// GET /api/workflows - List all workflows
app.get('/api/workflows', async (req, res) => {
  try {
    const files = await fs.readdir(WORKFLOWS_DIR);
    const workflows = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    res.json({ workflows: workflows.sort() });
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: 'Failed to list workflows' });
  }
});

// GET /api/workflows/:name - Get a specific workflow
app.get('/api/workflows/:name', async (req, res) => {
  try {
    const safeName = sanitizeFilename(req.params.name);
    const filePath = path.join(WORKFLOWS_DIR, `${safeName}.json`);
    
    const content = await fs.readFile(filePath, 'utf8');
    const workflow = JSON.parse(content);
    
    res.json(workflow);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Workflow not found' });
    } else {
      console.error('Error reading workflow:', error);
      res.status(500).json({ error: 'Failed to read workflow' });
    }
  }
});

// POST /api/workflows - Create or update a workflow
app.post('/api/workflows', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Workflow name is required' });
    }

    const workflow = {
      name,
      nodes: nodes || [],
      edges: edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const safeName = sanitizeFilename(name);
    const filePath = path.join(WORKFLOWS_DIR, `${safeName}.json`);
    
    // Check if file exists to determine if it's create or update
    let isUpdate = false;
    try {
      await fs.access(filePath);
      isUpdate = true;
      // Keep original createdAt if updating
      const existingContent = await fs.readFile(filePath, 'utf8');
      const existingWorkflow = JSON.parse(existingContent);
      workflow.createdAt = existingWorkflow.createdAt;
    } catch {
      // File doesn't exist, it's a new workflow
    }

    await fs.writeFile(filePath, JSON.stringify(workflow, null, 2));
    
    res.json({ 
      message: isUpdate ? 'Workflow updated successfully' : 'Workflow created successfully',
      workflow 
    });
  } catch (error) {
    console.error('Error saving workflow:', error);
    res.status(500).json({ error: 'Failed to save workflow' });
  }
});

// PUT /api/workflows/:name - Update a specific workflow
app.put('/api/workflows/:name', async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    const safeName = sanitizeFilename(req.params.name);
    const filePath = path.join(WORKFLOWS_DIR, `${safeName}.json`);
    
    // Check if workflow exists
    let existingWorkflow;
    try {
      const content = await fs.readFile(filePath, 'utf8');
      existingWorkflow = JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      throw error;
    }

    const updatedWorkflow = {
      ...existingWorkflow,
      nodes: nodes || existingWorkflow.nodes,
      edges: edges || existingWorkflow.edges,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(updatedWorkflow, null, 2));
    
    res.json({ 
      message: 'Workflow updated successfully',
      workflow: updatedWorkflow 
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// DELETE /api/workflows/:name - Delete a workflow
app.delete('/api/workflows/:name', async (req, res) => {
  try {
    const safeName = sanitizeFilename(req.params.name);
    const filePath = path.join(WORKFLOWS_DIR, `${safeName}.json`);
    
    await fs.unlink(filePath);
    
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Workflow not found' });
    } else {
      console.error('Error deleting workflow:', error);
      res.status(500).json({ error: 'Failed to delete workflow' });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Workflow server is running' });
});

app.listen(PORT, () => {
  console.log(`Workflow server running on port ${PORT}`);
  console.log(`Workflows stored in: ${WORKFLOWS_DIR}`);
}); 