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

  getCourses(): Course[] {
    return this.courses.slice();
  }
}