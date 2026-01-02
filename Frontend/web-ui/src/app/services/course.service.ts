import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

export interface Course {
  id: number;
  course_name: string;
  course_code: string;
  credit: number;
  department: string;
  semester: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.ApiUrl}/courses`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  addCourse(data: any): Observable<Course> {
    const currentUser = this.userService.current;
    const payload: any = {
      course_name: data.title,
      course_code: data.code,
      credit: data.credit,
      department: data.department,
      semester: data.semester
    };
    
    // Only include created_by if user is logged in
    if (currentUser?.id) {
      payload.created_by = currentUser.id;
    }
    
    return this.http.post<Course>(this.apiUrl, payload);
  }

  updateCourse(id: number, data: any): Observable<Course> {
    const payload = {
      course_name: data.title,
      course_code: data.code,
      credit: data.credit,
      department: data.department,
      semester: data.semester
    };
    return this.http.put<Course>(`${this.apiUrl}/${id}`, payload);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }
}