import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassSchedule, ClassScheduleService } from '../../../../services/class-schedule.service';
import { CourseService } from '../../../../services/course.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  courses: any[] = [];
  faculties: any[] = [];
  
  // Status options
  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'postponed', label: 'Postponed' }
  ];
  
  // Form controls
  editForm!: FormGroup;
  
  // UI States
  isLoading = false;
  showEditModal = false;
  selectedSchedule: ClassSchedule | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ClassScheduleService,
    private courseService: CourseService,
    private userService: UserService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSchedules();
    this.loadCourses();
    this.loadFaculties();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      course_id: ['', Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      status: ['scheduled', Validators.required]
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();
    
    const currentUserId = this.userService.current?.id;
    
    this.scheduleService.getSchedules().subscribe({
      next: (data: ClassSchedule[]) => {
        // Filter schedules to show only those assigned to current faculty
        this.schedules = data.filter(schedule => schedule.faculty_id == currentUserId);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading schedules:', err);
        this.errorMessage = 'Failed to load schedules';
        this.isLoading = false;
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data: any[]) => {
        this.courses = data;
      },
      error: (err: any) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  loadFaculties(): void {
    this.userService.list().subscribe({
      next: (data: any[]) => {
        this.faculties = data.filter((user: any) => user.roles.includes('Faculty'));
      },
      error: (err: any) => {
        console.error('Error loading faculties:', err);
      }
    });
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
    this.showEditModal = true;
    
    this.editForm.patchValue({
      course_id: schedule.course_id,
      faculty_id: schedule.faculty_id,
      class_date: schedule.class_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      status: schedule.status || 'scheduled'
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSchedule = null;
    this.editForm.reset();
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const updatedData = {
      course_id: this.editForm.get('course_id')?.value,
      faculty_id: this.editForm.get('faculty_id')?.value,
      class_date: this.editForm.get('class_date')?.value,
      start_time: this.editForm.get('start_time')?.value,
      end_time: this.editForm.get('end_time')?.value,
      status: this.editForm.get('status')?.value
    };

    if (this.selectedSchedule.id) {
      this.scheduleService.updateSchedule(this.selectedSchedule.id, updatedData).subscribe({
        next: () => {
          this.successMessage = 'Schedule updated successfully!';
          this.loadSchedules();
          this.closeEditModal();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err: any) => {
          console.error('Error updating schedule:', err);
          this.errorMessage = 'Failed to update schedule';
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getScheduleDisplay(schedule: ClassSchedule): string {
    const courseName = schedule.course?.course_name || 'Unknown Course';
    const date = schedule.class_date || 'No Date';
    return `${courseName} - ${date} ${schedule.start_time}-${schedule.end_time}`;
  }
}
