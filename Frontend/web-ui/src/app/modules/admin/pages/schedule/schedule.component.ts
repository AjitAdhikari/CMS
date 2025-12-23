import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface for class schedule
export interface ClassSchedule {
  id: number;
  courseId: number;
  courseName: string;
  department?: string;
  facultyId?: number;
  facultyName?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  scheduleType: 'regular' | 'one-time' | 'lab' | 'tutorial';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];

  private readonly storageKey = 'app_class_schedules';
  
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
  
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  scheduleTypes = [
    { value: 'regular', label: 'Regular Class' },
    { value: 'lab', label: 'Lab Session' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'one-time', label: 'One-Time Event' }
  ];

  // Mock data for dropdowns (replace with actual API calls)
  courses = [
    { id: 101, name: 'Advanced Data Structures' },
    { id: 102, name: 'Web Development' },
    { id: 103, name: 'Database Management' },
    { id: 104, name: 'Machine Learning' },
    { id: 105, name: 'Computer Networks' }
  ];

  faculties = [
    { id: 1, name: 'Dr. John Smith' },
    { id: 2, name: 'Prof. Sarah Johnson' },
    { id: 3, name: 'Dr. Michael Brown' },
    { id: 4, name: 'Prof. Emily Davis' }
  ];

  departments = [
    { value: 'BBA', label: 'BBA' },
    { value: 'BCA', label: 'BCA' },
    { value: 'BBA-TT', label: 'BBA-TT' }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  initializeForms(): void {
    this.scheduleForm = this.fb.group({
      courseId: ['', Validators.required],
      department: ['', Validators.required],
      facultyId: ['', Validators.required],
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      scheduleType: ['regular', Validators.required],
      isActive: [true]
    });

    this.editForm = this.fb.group({
      courseId: [{ value: '', disabled: true }, Validators.required],
      courseName: [{ value: '', disabled: true }, Validators.required],
      department: ['', Validators.required],
      facultyId: ['', Validators.required],
      facultyName: [{ value: '', disabled: true }],
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      scheduleType: ['regular', Validators.required],
      isActive: [true]
    });
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.clearMessages();

    try {
      const cached = localStorage.getItem(this.storageKey);
      if (cached) {
        this.schedules = this.sanitizeSchedules(JSON.parse(cached));
      } else {
        this.schedules = this.sanitizeSchedules(this.getSeedSchedules());
        this.persistSchedules();
      }
    } catch (error) {
      console.error('Failed to load schedules from storage', error);
      this.schedules = this.sanitizeSchedules(this.getSeedSchedules());
    } finally {
      this.isLoading = false;
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.scheduleForm.reset({ scheduleType: 'regular', isActive: true });
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.scheduleForm.reset();
  }

  openEditModal(schedule: ClassSchedule): void {
    this.selectedSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
    this.showEditModal = true;
    
    this.editForm.patchValue({
      courseId: schedule.courseId,
      courseName: schedule.courseName,
      facultyId: schedule.facultyId,
      facultyName: schedule.facultyName,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      scheduleType: schedule.scheduleType,
      isActive: schedule.isActive
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

    const formData = this.scheduleForm.value;
    const course = this.courses.find(c => c.id == formData.courseId);
    const faculty = this.faculties.find(f => f.id == formData.facultyId);

    const newSchedule: ClassSchedule = {
      id: this.schedules.length + 1,
      courseId: formData.courseId,
      courseName: course?.name || '',
      facultyId: formData.facultyId,
      facultyName: faculty?.name || '',
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      scheduleType: formData.scheduleType,
      isActive: formData.isActive,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.schedules.push(newSchedule);
    this.persistSchedules();
    this.successMessage = 'Schedule created successfully!';
    this.closeAddModal();
    setTimeout(() => this.clearMessages(), 3000);
  }

  updateSchedule(): void {
    if (this.editForm.invalid || !this.selectedSchedule) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = this.editForm.getRawValue();
    const faculty = this.faculties.find(f => f.id == formData.facultyId);

    if (this.selectedSchedule.id) {
      const index = this.schedules.findIndex(s => s.id === this.selectedSchedule!.id);
      if (index !== -1) {
        this.schedules[index] = {
          ...this.schedules[index],
          facultyId: formData.facultyId,
          facultyName: faculty?.name || this.schedules[index].facultyName,
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime,
          scheduleType: formData.scheduleType,
          isActive: formData.isActive,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        this.persistSchedules();
        this.successMessage = 'Schedule updated successfully!';
        this.closeEditModal();
        setTimeout(() => this.clearMessages(), 3000);
      }
    }
  }

  deleteSchedule(schedule: ClassSchedule): void {
    if (confirm(`Are you sure you want to delete the schedule for "${schedule.courseName}"?`)) {
      const index = this.schedules.findIndex(s => s.id === schedule.id);
      if (index !== -1) {
        this.schedules.splice(index, 1);
        this.persistSchedules();
        this.successMessage = 'Schedule deleted successfully!';
        setTimeout(() => this.clearMessages(), 3000);
      }
    }
  }

  getScheduleTypeLabel(type: string): string {
    const scheduleType = this.scheduleTypes.find(st => st.value === type);
    return scheduleType ? scheduleType.label : type;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getScheduleDisplay(schedule: ClassSchedule): string {
    return `${schedule.courseName} - ${schedule.dayOfWeek} ${schedule.startTime}-${schedule.endTime}`;
  }

  private persistSchedules(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.schedules));
    } catch (error) {
      console.error('Failed to persist schedules to storage', error);
    }
  }

  private getSeedSchedules(): ClassSchedule[] {
    return [
      {
        id: 1,
        courseId: 101,
        courseName: 'Advanced Data Structures',
        facultyId: 1,
        facultyName: 'Dr. John Smith',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        scheduleType: 'regular',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      },
      {
        id: 2,
        courseId: 102,
        courseName: 'Web Development',
        facultyId: 2,
        facultyName: 'Prof. Sarah Johnson',
        dayOfWeek: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
        scheduleType: 'regular',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      },
      {
        id: 3,
        courseId: 103,
        courseName: 'Database Management',
        facultyId: 3,
        facultyName: 'Dr. Michael Brown',
        dayOfWeek: 'Friday',
        startTime: '14:00',
        endTime: '15:30',
        scheduleType: 'lab',
        isActive: true,
        createdAt: '2025-12-01',
        updatedAt: '2025-12-20'
      }
    ];
  }

  private sanitizeSchedules(raw: any[]): ClassSchedule[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map((item, index) => {
      const id = typeof item.id === 'number' ? item.id : index + 1;
      return {
        id,
        courseId: Number(item.courseId) || 0,
        courseName: item.courseName || '',
        facultyId: item.facultyId ? Number(item.facultyId) : undefined,
        facultyName: item.facultyName || '',
        dayOfWeek: item.dayOfWeek || '',
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        scheduleType: item.scheduleType || 'regular',
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString().split('T')[0]
      };
    });
  }
}

