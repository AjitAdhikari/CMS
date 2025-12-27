import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course, CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})
export class AddCoursesComponent {
  model = { title: '', code: '', department: '', description: '', syllabus: null as File | null };

  courses: Course[] = [];
  editingId: number | null = null;

  showForm = false;

  constructor(private courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }

  submit(form: NgForm) {
    if (!form.valid) return;

    if (this.editingId !== null) {
      this.courseService.updateCourse(this.editingId, {
        title: this.model.title,
        code: this.model.code,
        department: this.model.department,
        description: this.model.description,
        syllabus: this.model.syllabus
      });
      this.editingId = null;
    } else {
      const added = this.courseService.addCourse({
        title: this.model.title,
        code: this.model.code,
        department: this.model.department,
        description: this.model.description,
        syllabus: this.model.syllabus
      });
    }

    this.model = { title: '', code: '', department: '', description: '', syllabus: null };
    this.courses = this.courseService.getCourses();
    form.resetForm();
    this.showForm = false;

  }

  edit(course: Course) {
    this.model = {
      title: course.title,
      code: course.code,
      department: course.department || '',
      description: course.description || '',
      syllabus: null
    };
    this.editingId = course.id;
    this.showForm = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id);
      this.courses = this.courseService.getCourses();
      // deletion acknowledged by list refresh
    }
  }

  cancel() {
    this.editingId = null;
    this.model = { title: '', code: '', department: '', description: '', syllabus: null };
    this.showForm = false;
  }

  onSyllabusSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (validTypes.includes(file.type)) {
        this.model.syllabus = file;
      } else {
        alert('Please upload a valid file (PDF, DOC, DOCX)');
        input.value = '';
      }
    }
  }
}
