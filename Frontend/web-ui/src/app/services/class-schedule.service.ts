import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClassSchedule {
  id: number;
  course_id: number;
  faculty_id: string;
  class_date: string;
  start_time: string;
  end_time: string;
  room?: string;
  status: 'scheduled' | 'cancelled' | 'rescheduled';
  created_at?: string;
  updated_at?: string;
  course?: any;
  faculty?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ClassScheduleService {
  private apiUrl = `${environment.ApiUrl}/class-schedules`;

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<ClassSchedule[]> {
    return this.http.get<ClassSchedule[]>(this.apiUrl);
  }

  getSchedule(id: number): Observable<ClassSchedule> {
    return this.http.get<ClassSchedule>(`${this.apiUrl}/${id}`);
  }

  createSchedule(data: Partial<ClassSchedule>): Observable<ClassSchedule> {
    return this.http.post<ClassSchedule>(this.apiUrl, data);
  }

  updateSchedule(id: number, data: Partial<ClassSchedule>): Observable<ClassSchedule> {
    return this.http.put<ClassSchedule>(`${this.apiUrl}/${id}`, data);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
