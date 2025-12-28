import { Injectable } from '@angular/core';

export interface Course {
  id: number;
  title: string;
  code: string;
  department?: string;
  semester?: number;
  description?: string;
  syllabus?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private nextId = 1;
  private readonly storageKey = 'app_courses';

  constructor() {
    this.loadFromStorage();
  }

  addCourse(data: Omit<Course, 'id'>) {
    const course: Course = { id: this.nextId++, ...data } as Course;
    this.courses.unshift(course);
    this.persist();
    return course;
  }

  updateCourse(id: number, data: Omit<Course, 'id'>) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = { id, ...data } as Course;
      this.persist();
    }
  }

  deleteCourse(id: number) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      this.persist();
    }
  }

  getCourses(): Course[] {
    return this.courses.slice();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        this.courses = parsed.map((c, idx) => ({
          id: typeof c.id === 'number' ? c.id : idx + 1,
          title: c.title || '',
          code: c.code || '',
          department: c.department || '',
          semester: c.semester !== undefined ? Number(c.semester) : undefined,
          description: c.description || ''
        }));
        const maxId = this.courses.reduce((max, c) => Math.max(max, c.id), 0);
        this.nextId = maxId + 1;
      }
    } catch (error) {
      console.error('Failed to load courses from storage', error);
      this.courses = [];
      this.nextId = 1;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.courses));
    } catch (error) {
      console.error('Failed to persist courses to storage', error);
    }
  }
}