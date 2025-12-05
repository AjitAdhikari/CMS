import { Component } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  files: File[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const selected = Array.from(input.files);
    this.files.push(...selected);

    input.value = '';
  }

  uploadAll() {
    if (this.files.length === 0) {
      return;
    }

    const form = new FormData();
    this.files.forEach((f) => {
      form.append('files[]', f, f.name);
    });
    for (const pair of (form as any).entries()) {
      console.log(pair);
    }
  }

  removeFile(index: number) {
    if (index >= 0 && index < this.files.length) {
      this.files.splice(index, 1);
    }
  }
}
