import { Component } from '@angular/core';
import { Course, CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  recentCourses: Course[] = [];

  constructor(private courseService: CourseService) {
    this.recentCourses = this.courseService.getCourses().slice(0,5);
  }

}
