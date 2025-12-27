import { Component } from '@angular/core';

interface Department {
  id: number;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent {
  departments: Department[] = [
    { id: 1, title: 'BBA', description: 'Management ' },
    { id: 2, title: 'BCA', description: 'Computer Applications' }
  ];

  showForm = false;
  isEdit = false;
  formModel: Partial<Department> = { title: '', description: '' };
  

  openCreate() {
    this.isEdit = false;
    this.formModel = { title: '', description: '' };
    this.showForm = true;
  }

  openEdit(dep: Department) {
    this.isEdit = true;
    this.formModel = { id: dep.id, title: dep.title, description: dep.description };
    this.showForm = true;
  }

  save() {
    if (!this.formModel.title || this.formModel.title.trim() === '') return;

    if (this.isEdit && this.formModel.id != null) {
      const idx = this.departments.findIndex(d => d.id === this.formModel.id);
      if (idx > -1) {
        this.departments[idx] = { id: this.formModel.id, title: this.formModel.title!.trim(), description: this.formModel.description } as Department;
      }
    } else {
      const newDep: Department = { id: Date.now(), title: this.formModel.title!.trim(), description: this.formModel.description };
      this.departments = [newDep, ...this.departments];
    }

    this.cancel();
  }

  delete(id?: number) {
    if (id == null) return;
    if (!confirm('Delete this department?')) return;
    this.departments = this.departments.filter(d => d.id !== id);
  }

  cancel() {
    this.showForm = false;
    this.isEdit = false;
    this.formModel = { title: '', description: '' };
  }

  trackById(index: number, item: Department) {
    return item.id;
  }

}
