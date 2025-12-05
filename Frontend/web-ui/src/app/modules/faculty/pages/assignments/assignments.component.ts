import { Component } from '@angular/core';

export interface StoredAssignment {
  id: string;
  title: string;
  course?: string;
  due: string;
  fileName?: string;
  fileDataUrl?: string | null;
  createdAt: number;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent {
  uploadOpen = false;
  selectedFiles: File[] = [];

  assignments: StoredAssignment[] = [];

  private storageKey = 'cms_assignments';

  constructor() {
    this.loadLocalAssignments();
  }

  openUpload() {
    this.uploadOpen = true;
  }

  closeUpload() {
    this.uploadOpen = false;
    this.selectedFiles = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files.item(0);
    if (file) {
      this.selectedFiles = [file];
    }
    input.value = '';
    this.openUpload();
  }

  removeFile(index: number) {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles = [];
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const file = event.dataTransfer.files.item(0);
    if (file) {
      this.selectedFiles = [file];
      this.openUpload();
    }
  }

  private saveAssignmentsToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.assignments));
    } catch (e) {
      console.error('Failed to save assignments to localStorage', e);
    }
  }

  private loadLocalAssignments() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.assignments = [];
        return;
      }
      this.assignments = JSON.parse(raw) as StoredAssignment[];
    } catch (e) {
      console.error('Failed to load assignments from localStorage', e);
      this.assignments = [];
    }
  }

  submitAssignment(title: string, course: string, due: string) {
    if (!title || !course || !due) {
      alert('Please provide title, course and due date');
      return;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const base: StoredAssignment = {
      id,
      title,
      course,
      due,
      createdAt: Date.now(),
    };

    const file = this.selectedFiles.length > 0 ? this.selectedFiles[0] : null;
    if (!file) {
      this.assignments.unshift(base);
      this.saveAssignmentsToStorage();
      alert('Assignment saved locally');
      this.closeUpload();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      const item: StoredAssignment = {
        ...base,
        fileName: file.name,
        fileDataUrl: dataUrl,
      };
      this.assignments.unshift(item);
      this.saveAssignmentsToStorage();
      alert('Assignment (with attachment) saved locally');
      this.closeUpload();
    };
    reader.onerror = (err) => {
      console.error('Failed to read file', err);
      // still save without file
      this.assignments.unshift(base);
      this.saveAssignmentsToStorage();
      alert('Assignment saved locally (failed to read attachment)');
      this.closeUpload();
    };
    // read as data URL (may be large); consider changing to not store file bytes in localStorage for large files
    reader.readAsDataURL(file);
  }

  downloadAttachment(a: StoredAssignment) {
    if (!a.fileDataUrl || !a.fileName) {
      alert('No attachment available');
      return;
    }
    const link = document.createElement('a');
    link.href = a.fileDataUrl;
    link.download = a.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteAssignment(id: string) {
    this.assignments = this.assignments.filter(a => a.id !== id);
    this.saveAssignmentsToStorage();
  }

  viewSubmissions(a: StoredAssignment) {
    // Placeholder for viewing submissions — implement as needed.
    alert(`View submissions for: ${a.title}`);
  }
}
