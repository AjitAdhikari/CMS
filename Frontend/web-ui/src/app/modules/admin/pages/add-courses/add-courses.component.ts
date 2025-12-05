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

  constructor(private courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }

  submit(form: NgForm) {
    if (!form.valid) return;
    const added = this.courseService.addCourse({
      title: this.model.title,
      code: this.model.code,
      description: this.model.description
    });
    this.successMessage = `Course "${added.title}" added.`;
    this.model = { title: '', code: '', description: '' };
    this.courses = this.courseService.getCourses();
    form.resetForm();
    setTimeout(() => this.successMessage = '', 3500);
  }
}
