import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course, CourseService } from '../../../../services/course.service';
import { DepartmentPayload, DepartmentService } from '../../../../services/department.service';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.css']
})
export class AddCoursesComponent implements OnInit {
  model = { title: '', code: '', credit: 0, department: '', semester: 1 };

  courses: Course[] = [];
  departments: DepartmentPayload[] = [];
  editingId: number | null = null;

  showForm = false;

  constructor(
    private courseService: CourseService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadDepartments();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  loadDepartments() {
    this.departmentService.list().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  submit(form: NgForm) {
    if (!form.valid) return;

    if (this.editingId !== null) {
      this.courseService.updateCourse(this.editingId, {
        title: this.model.title,
        code: this.model.code,
        credit: this.model.credit,
        department: this.model.department,
        semester: this.model.semester
      }).subscribe({
        next: () => {
          this.editingId = null;
          this.resetForm(form);
          this.loadCourses();
        },
        error: (err) => {
          console.error('Failed to update course', err);
          const errorMsg = err?.error?.message || err?.error?.error || 'Failed to update course. Please try again.';
          alert(errorMsg);
        }
      });
    } else {
      this.courseService.addCourse({
        title: this.model.title,
        code: this.model.code,
        credit: this.model.credit,
        department: this.model.department,
        semester: this.model.semester
      }).subscribe({
        next: () => {
          this.resetForm(form);
          this.loadCourses();
        },
        error: (err) => {
          console.error('Failed to add course', err);
          const errorMsg = err?.error?.message || err?.error?.error || 'Failed to add course. Please try again.';
          alert(errorMsg);
        }
      });
    }
  }

  resetForm(form: NgForm) {
    this.model = { title: '', code: '', credit: 0, department: '', semester: 1 };
    form.resetForm();
    this.showForm = false;
  }

  edit(course: Course) {
    this.model = {
      title: course.course_name,
      code: course.course_code,
      credit: course.credit || 0,
      department: course.department || '',
      semester: course.semester || 1
    };
    this.editingId = course.id;
    this.showForm = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (err) => {
          console.error('Failed to delete course', err);
          alert('Failed to delete course. Please try again.');
        }
      });
    }
  }

  cancel() {
    this.editingId = null;
    this.model = { title: '', code: '', credit: 0, department: '', semester: 1 };
    this.showForm = false;
  }
}
