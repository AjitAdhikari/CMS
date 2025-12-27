import { Component, ElementRef, ViewChild } from '@angular/core';

export interface StoredAssignment {
  id: string;
  title: string;
  description?: string;
  due: string;
  fileName?: string;
  fileDataUrl?: string | null;
  feedback?: string;
  submissions?: Submission[];
  createdAt: number;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  fileName?: string;
  fileDataUrl?: string | null;
  submittedAt: number;
  feedback?: string;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent {
  @ViewChild('title') titleInput!: ElementRef;
  @ViewChild('due') dueInput!: ElementRef;
  @ViewChild('description') descriptionInput!: ElementRef;

  selectedFiles: File[] = [];
  assignments: StoredAssignment[] = [];
  showForm = false;
  feedbackTarget: StoredAssignment | null = null;
  feedbackText = '';
  submissionsTarget: StoredAssignment | null = null;

  private storageKey = 'cms_assignments';

  constructor() {
    this.loadLocalAssignments();
  }

  clearForm() {
    this.selectedFiles = [];
    if (this.titleInput) this.titleInput.nativeElement.value = '';
    if (this.dueInput) this.dueInput.nativeElement.value = '';
    if (this.descriptionInput) this.descriptionInput.nativeElement.value = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files.item(0);
    if (file) {
      this.selectedFiles = [file];
    }
    input.value = '';
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

  submitAssignment(title: string, description: string, due: string) {
    if (!title || !due) {
      alert('Please provide title and due date');
      return;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const base: StoredAssignment = {
      id,
      title,
      description,
      due,
      createdAt: Date.now(),
    };

    const file = this.selectedFiles.length > 0 ? this.selectedFiles[0] : null;
    if (!file) {
      this.assignments.unshift(base);
      this.saveAssignmentsToStorage();
      this.clearForm();
      this.showForm = false;
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
      this.clearForm();
      this.showForm = false;
    };
    reader.onerror = (err) => {
      console.error('Failed to read file', err);
      this.assignments.unshift(base);
      this.saveAssignmentsToStorage();
      alert('Assignment created (file attachment skipped)');
      this.clearForm();
    };
    reader.readAsDataURL(file);
  }

  openCreate() {
    console.log('openCreate called');
    this.showForm = true;
  }

  openFeedback(a: StoredAssignment) {
    this.feedbackTarget = a;
    this.feedbackText = a.feedback || '';
  }

  openSubmissions(a: StoredAssignment) {
    // ensure submissions array exists (in real app this would come from server)
    if (!a.submissions) a.submissions = [];
    this.submissionsTarget = a;
  }

  saveSubmissionFeedback(s: Submission) {
    // find parent assignment and submission, then persist
    if (!this.submissionsTarget) return;
    const assgn = this.assignments.find(x => x.id === this.submissionsTarget!.id);
    if (!assgn || !assgn.submissions) return;
    const idx = assgn.submissions.findIndex(x => x.id === s.id);
    if (idx > -1) {
      assgn.submissions[idx].feedback = s.feedback || '';
      this.saveAssignmentsToStorage();
      alert('Feedback saved for ' + s.studentName);
    }
  }

  closeSubmissions() {
    this.submissionsTarget = null;
  }

  saveFeedback() {
    if (!this.feedbackTarget) return;
    this.feedbackTarget.feedback = this.feedbackText;
    this.saveAssignmentsToStorage();
    this.feedbackTarget = null;
    this.feedbackText = '';
  }

  cancelFeedback() {
    this.feedbackTarget = null;
    this.feedbackText = '';
  }

  downloadAttachment(a: { fileDataUrl?: string | null; fileName?: string | undefined; }) {
    if (!a || !a.fileDataUrl || !a.fileName) {
      alert('No attachment available');
      return;
    }
    const link = document.createElement('a');
    link.href = a.fileDataUrl;
    link.download = a.fileName as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteAssignment(id: string) {
    this.assignments = this.assignments.filter(a => a.id !== id);
    this.saveAssignmentsToStorage();
  }

  viewSubmissions(a: StoredAssignment) {
    alert(`View submissions for: ${a.title}`);
  }
}
