import { Component, OnInit } from '@angular/core';
import { ClassSchedule, ClassScheduleService } from '../../../../services/class-schedule.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private scheduleService: ClassScheduleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const currentUser = this.userService.current;
    const currentSemester = currentUser?.semesters;
    
    this.scheduleService.getSchedules().subscribe({
      next: (data: ClassSchedule[]) => {
        // Filter schedules to show only those for student's semester
        if (currentSemester) {
          this.schedules = data.filter(schedule => 
            schedule.course?.semester == currentSemester
          );
        } else {
          this.schedules = data;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading schedules:', err);
        this.errorMessage = 'Failed to load schedules';
        this.isLoading = false;
      }
    });
  }

  get filteredSchedules(): ClassSchedule[] {
    return this.schedules;
  }
}
