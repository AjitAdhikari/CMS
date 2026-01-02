import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassSchedule, ClassScheduleService } from '../../../../services/class-schedule.service';
import { Course, CourseService } from '../../../../services/course.service';
import { User, UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  
  // Form controls
  scheduleForm!: FormGroup;
  editForm!: FormGroup;
  
  // UI States
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  selectedSchedule: ClassSchedule | null = null;
  successMessage = '';
  errorMessage = '';
  
  courses: Course[] = [];
  faculties: User[] = [];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ClassScheduleService,
    private courseService: CourseService,
    private userService: UserService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadFaculties();
    this.loadSchedules();
  }

  initializeForms(): void {
    this.scheduleForm = this.fb.group({
      course_id: ['', Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      course_id: ['', Validators.required],
      faculty_id: ['', Validators.required],
      class_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data: Course[]) => {
        this.courses = data;
      },
      error: (err: any) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  loadFaculties(): void {
    this.userService.list().subscribe({
      next: (users: User[]) => {
        this.faculties = users.filter((u: User) => u.roles.includes('Faculty'));
      },
      error: (err: any) => {
        console.error('Failed to load faculties', err);
      }
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();

    this.scheduleService.getSchedules().subscribe({
      next: (data: ClassSchedule[]) => {
        this.schedules = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load schedules', err);
        this.errorMessage = 'Failed to load schedules';
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.scheduleForm.reset();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.scheduleForm.reset();
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = schedule;
    this.showEditModal = true;
    
    this.editForm.patchValue({
      id: schedule.id,
      course_id: schedule.course_id,
      faculty_id: schedule.faculty_id,
      class_date: schedule.class_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSchedule = null;
    this.editForm.reset();
  }

  createSchedule(): void {
    if (this.scheduleForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = { ...this.scheduleForm.value, status: 'scheduled' };
    this.scheduleService.createSchedule(formData).subscribe({
      next: () => {
        this.successMessage = 'Schedule created successfully!';
        this.closeAddModal();
        this.loadSchedules();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err: any) => {
        console.error('Failed to create schedule', err);
        this.errorMessage = err?.error?.message || 'Failed to create schedule';
      }
    });
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = this.editForm.getRawValue();
    this.scheduleService.updateSchedule(this.selectedSchedule.id, formData).subscribe({
      next: () => {
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        this.loadSchedules();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err: any) => {
        console.error('Failed to update schedule', err);
        this.errorMessage = err?.error?.message || 'Failed to update schedule';
      }
    });
  }

  deleteSchedule(schedule: ClassSchedule): void {
    if (confirm(`Are you sure you want to delete this schedule?`)) {
      this.scheduleService.deleteSchedule(schedule.id).subscribe({
        next: () => {
          this.successMessage = 'Schedule deleted successfully!';
          this.loadSchedules();
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err: any) => {
          console.error('Failed to delete schedule', err);
          this.errorMessage = 'Failed to delete schedule';
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}

