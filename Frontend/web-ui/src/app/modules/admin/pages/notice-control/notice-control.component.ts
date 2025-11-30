import { Component } from '@angular/core';

@Component({
  selector: 'app-notice-control',
  templateUrl: './notice-control.component.html',
  styleUrls: ['./notice-control.component.css']
})
export class NoticeControlComponent { 
  currentView: 'admin' | 'university' = 'admin'; 
  adminNotice = {
    title: '',
    content: '',
    file: null as File | null
  };
 
  notices: Array<{ title: string; content: string; fileName?: string | null; createdAt: Date }> = [];

  selectView(view: 'admin' | 'university') {
    this.currentView = view;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.adminNotice.file = input.files[0];
    } else {
      this.adminNotice.file = null;
    }
  }

  uploadAdminNotice() { 
    console.log('Uploading admin notice', this.adminNotice); 
    this.notices.unshift({
      title: this.adminNotice.title || '(no title)',
      content: this.adminNotice.content || '',
      fileName: this.adminNotice.file ? this.adminNotice.file.name : null,
      createdAt: new Date()
    });
 
    this.adminNotice = { title: '', content: '', file: null };
  }
}
