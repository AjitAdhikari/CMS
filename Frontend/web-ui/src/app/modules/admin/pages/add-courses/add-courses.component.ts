import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course, CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})
export class AddCoursesComponent {
  model = { title: '', code: '', description: '' };
  successMessage = '';
  courses: Course[] = [];
  editingId: number | null = null;

  constructor(private courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }

  submit(form: NgForm) {
    if (!form.valid) return;
    
    if (this.editingId !== null) {
      this.courseService.updateCourse(this.editingId, {
        title: this.model.title,
        code: this.model.code,
        description: this.model.description
      });
      this.successMessage = `Course "${this.model.title}" updated.`;
      this.editingId = null;
    } else {
      const added = this.courseService.addCourse({
        title: this.model.title,
        code: this.model.code,
        description: this.model.description
      });
      this.successMessage = `Course "${added.title}" added.`;
    }
    
    this.model = { title: '', code: '', description: '' };
    this.courses = this.courseService.getCourses();
    form.resetForm();
    setTimeout(() => this.successMessage = '', 3500);
  }

  edit(course: Course) {
    this.model = { title: course.title, code: course.code, description: course.description || '' };
    this.editingId = course.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id);
      this.courses = this.courseService.getCourses();
      this.successMessage = 'Course deleted successfully.';
      setTimeout(() => this.successMessage = '', 3500);
    }
  }

  cancel() {
    this.editingId = null;
    this.model = { title: '', code: '', description: '' };
  }
}
