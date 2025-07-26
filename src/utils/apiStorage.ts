import { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

class ApiStorageManager {
  private readonly API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api'  // Use relative path in production
    : 'http://localhost:3001/api';  // Development server

  // Check if server is available
  async isServerAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/health`);
      return response.ok;
    } catch (error) {
      console.warn('Server not available, falling back to localStorage');
      return false;
    }
  }

  // Save workflow to server
  async saveWorkflow(workflow: WorkflowData): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to save workflow:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return false;
    }
  }

  // Load workflow from server by name
  async loadWorkflow(workflowName: string): Promise<WorkflowData | null> {
    try {
      const response = await fetch(`${this.API_BASE}/workflows/${encodeURIComponent(workflowName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Workflow "${workflowName}" not found`);
        } else {
          console.error('Failed to load workflow:', await response.text());
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to load workflow "${workflowName}":`, error);
      return null;
    }
  }

  // List all available workflows
  async listWorkflows(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_BASE}/workflows`);
      
      if (!response.ok) {
        console.error('Failed to list workflows:', await response.text());
        return [];
      }

      const data = await response.json();
      return data.workflows || [];
    } catch (error) {
      console.error('Failed to list workflows:', error);
      return [];
    }
  }

  // Delete a workflow
  async deleteWorkflow(workflowName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/workflows/${encodeURIComponent(workflowName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to delete workflow:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete workflow "${workflowName}":`, error);
      return false;
    }
  }

  // Update an existing workflow
  async updateWorkflow(workflowName: string, nodes: Node[], edges: Edge[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/workflows/${encodeURIComponent(workflowName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to update workflow:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to update workflow "${workflowName}":`, error);
      return false;
    }
  }

  // Fallback to localStorage methods (same as before)
  saveToLocalStorage(workflow: WorkflowData): void {
    localStorage.setItem('workflow_nodes', JSON.stringify(workflow.nodes));
    localStorage.setItem('workflow_edges', JSON.stringify(workflow.edges));
    localStorage.setItem('workflow_name', workflow.name);
  }

  loadFromLocalStorage(): Partial<WorkflowData> {
    const savedNodes = localStorage.getItem('workflow_nodes');
    const savedEdges = localStorage.getItem('workflow_edges');
    const savedName = localStorage.getItem('workflow_name');
    
    return {
      nodes: savedNodes ? JSON.parse(savedNodes) : [],
      edges: savedEdges ? JSON.parse(savedEdges) : [],
      name: savedName || 'Untitled Workflow'
    };
  }
}

// Export singleton instance
export const apiStorage = new ApiStorageManager(); 