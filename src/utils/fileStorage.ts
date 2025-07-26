import { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

class FileStorageManager {
  private readonly FLOWS_DIR = 'flows';
  private dirHandle: FileSystemDirectoryHandle | null = null;

  // Initialize the file system access
  async initialize(): Promise<boolean> {
    try {
      // Check if File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        console.warn('File System Access API not supported, falling back to localStorage');
        return false;
      }

      // Try to get existing directory handle from IndexedDB
      const existingHandle = await this.getStoredDirectoryHandle();
      if (existingHandle) {
        try {
          // Verify we still have permission
          if (await existingHandle.queryPermission() === 'granted') {
            this.dirHandle = existingHandle;
            return true;
          }
        } catch (error) {
          console.log('Stored directory handle is no longer valid');
        }
      }

      // Request new directory access
      this.dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });

      // Store the handle for future use
      await this.storeDirectoryHandle(this.dirHandle);
      return true;
    } catch (error) {
      console.error('Failed to initialize file storage:', error);
      return false;
    }
  }

  // Save workflow to file
  async saveWorkflow(workflow: WorkflowData): Promise<boolean> {
    try {
      if (!this.dirHandle) {
        throw new Error('File system not initialized');
      }

      // Create flows subdirectory if it doesn't exist
      let flowsDir: FileSystemDirectoryHandle;
      try {
        flowsDir = await this.dirHandle.getDirectoryHandle(this.FLOWS_DIR);
      } catch {
        flowsDir = await this.dirHandle.getDirectoryHandle(this.FLOWS_DIR, { create: true });
      }

      // Create safe filename from workflow name
      const safeFilename = this.sanitizeFilename(workflow.name) + '.json';
      
      // Create or get the file handle
      const fileHandle = await flowsDir.getFileHandle(safeFilename, { create: true });
      
      // Create writable stream and write data
      const writable = await fileHandle.createWritable();
      const workflowWithTimestamp = {
        ...workflow,
        updatedAt: new Date().toISOString()
      };
      await writable.write(JSON.stringify(workflowWithTimestamp, null, 2));
      await writable.close();

      return true;
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return false;
    }
  }

  // Load workflow from file by name
  async loadWorkflow(workflowName: string): Promise<WorkflowData | null> {
    try {
      if (!this.dirHandle) {
        throw new Error('File system not initialized');
      }

      const flowsDir = await this.dirHandle.getDirectoryHandle(this.FLOWS_DIR);
      const safeFilename = this.sanitizeFilename(workflowName) + '.json';
      const fileHandle = await flowsDir.getFileHandle(safeFilename);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      return JSON.parse(content) as WorkflowData;
    } catch (error) {
      console.error(`Failed to load workflow "${workflowName}":`, error);
      return null;
    }
  }

  // List all available workflows
  async listWorkflows(): Promise<string[]> {
    try {
      if (!this.dirHandle) {
        return [];
      }

      const flowsDir = await this.dirHandle.getDirectoryHandle(this.FLOWS_DIR);
      const workflows: string[] = [];
      
      for await (const [name, handle] of flowsDir.entries()) {
        if (handle.kind === 'file' && name.endsWith('.json')) {
          // Remove .json extension to get workflow name
          const workflowName = name.slice(0, -5);
          workflows.push(workflowName);
        }
      }
      
      return workflows.sort();
    } catch (error) {
      console.error('Failed to list workflows:', error);
      return [];
    }
  }

  // Delete a workflow
  async deleteWorkflow(workflowName: string): Promise<boolean> {
    try {
      if (!this.dirHandle) {
        throw new Error('File system not initialized');
      }

      const flowsDir = await this.dirHandle.getDirectoryHandle(this.FLOWS_DIR);
      const safeFilename = this.sanitizeFilename(workflowName) + '.json';
      await flowsDir.removeEntry(safeFilename);
      
      return true;
    } catch (error) {
      console.error(`Failed to delete workflow "${workflowName}":`, error);
      return false;
    }
  }

  // Check if file system is available
  isAvailable(): boolean {
    return this.dirHandle !== null;
  }

  // Get the name of the selected directory (if available)
  getDirectoryInfo(): string | null {
    return this.dirHandle?.name || null;
  }

  // Fallback to localStorage methods
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

  // Utility methods
  private sanitizeFilename(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  private async storeDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
    const request = indexedDB.open('workflow-storage', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['handles'], 'readwrite');
        const store = transaction.objectStore('handles');
        store.put(handle, 'flows-directory');
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('handles');
      };
    });
  }

  private async getStoredDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
    const request = indexedDB.open('workflow-storage', 1);
    
    return new Promise((resolve) => {
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['handles'], 'readonly');
        const store = transaction.objectStore('handles');
        const getRequest = store.get('flows-directory');
        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = () => resolve(null);
      };
      request.onupgradeneeded = () => resolve(null);
    });
  }
}

// Export singleton instance
export const fileStorage = new FileStorageManager(); 