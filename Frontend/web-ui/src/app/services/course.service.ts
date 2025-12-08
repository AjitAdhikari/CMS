import { Injectable } from '@angular/core';

export interface Course {
  id: number;
  title: string;
  code: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private nextId = 1;

  constructor() { }

  addCourse(data: Omit<Course, 'id'>) {
    const course: Course = { id: this.nextId++, ...data } as Course;
    this.courses.unshift(course);
    return course;
  }

  updateCourse(id: number, data: Omit<Course, 'id'>) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = { id, ...data } as Course;
    }
  }

  deleteCourse(id: number) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
  }

  getCourses(): Course[] {
    return this.courses.slice();
  }
}