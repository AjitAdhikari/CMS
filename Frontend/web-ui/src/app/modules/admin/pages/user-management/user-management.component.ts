import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '../../../../services/course.service';
import { User, UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: string[] = ['Admin', 'Student', 'Faculty'];
  courses: Course[] = [];

  // UI state
  showForm = false;
  editing = false;
  currentAddRole: 'Admin' | 'Student' | 'Faculty' = 'Admin';
  tempUser: Partial<User> = {};
  searchTerm = '';
  roleFilter = 'Admin';
  loading = false;
  errorMessage = '';

  constructor(private courseService: CourseService, private userService: UserService) {}

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.errorMessage = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(u => {
      const matchesTerm = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchesRole = !this.roleFilter || u.roles.includes(this.roleFilter);
      return matchesTerm && matchesRole;
    });
  }

  getSubjectsDisplay(subjects?: string): string {
    if (!subjects) return '-';
    const course = this.courses.find(c => c.title === subjects);
    return course ? course.title : subjects;
  }

  get modalTitle(): string {
    if (this.editing) {
      const role = (this.tempUser.roles && this.tempUser.roles.length) ? this.tempUser.roles[0] : 'User';
      return `Edit ${role}`;
    }
    return `Add ${this.currentAddRole || this.roleFilter}`;
  }

  setRoleFilter(role: string): void {
    this.roleFilter = role;
  }

  openAddForRole(role: 'Admin' | 'Student' | 'Faculty'): void {
    this.editing = false;
    this.currentAddRole = role;
    this.tempUser = { name: '', email: '', roles: [role], status: 'Active' };
    if (role === 'Student') this.tempUser.semester = 1;
    if (role === 'Faculty') this.tempUser.subjects = undefined;
    this.showForm = true;
  }

  openAddCurrent(): void {
    this.openAddForRole(this.roleFilter as 'Admin' | 'Student' | 'Faculty');
  }

  countByRole(role: string): number {
    return this.users.filter(u => u.roles.includes(role)).length;
  }

  openAdd(): void {
    this.openAddForRole(this.roleFilter as 'Admin' | 'Student' | 'Faculty');
  }

  openEdit(user: User): void {
    this.editing = true;
    this.tempUser = { ...user };
    this.currentAddRole = (user.roles && user.roles.length) ? (user.roles[0] as 'Admin' | 'Student' | 'Faculty') : 'Admin';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.tempUser = {};
  }

  saveUser(): void {
    const t = this.tempUser as User;
    if (!t.name || !t.email) {
      alert('Please provide name and email.');
      return;
    }

    // Backend requires password on create (especially for Faculty/Student)
    if (!this.editing && !t.password) {
      alert('Please provide a password.');
      return;
    }
    this.loading = true;

    if (this.editing && t.id !== undefined) {
      const payload: Partial<User> & { roles: string[] } = {
        ...t,
        roles: this.tempUser.roles || [this.currentAddRole]
      };

      this.userService.update(t.id, payload).subscribe({
        next: () => {
          this.loading = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Failed to update user', err);
          alert('Failed to update user.');
          this.loading = false;
        }
      });
    } else {
      const role = this.currentAddRole || (this.roleFilter as 'Admin' | 'Student' | 'Faculty');
      const payload: Partial<User> & { roles: string[] } = {
        ...t,
        roles: [role],
        status: t.status || 'Active',
        semester: role === 'Student' ? ((t as any).semester || 1) : undefined
      };

      this.userService.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Failed to create user', err);
          alert('Failed to create user.');
          this.loading = false;
        }
      });
    }
  }

  deleteUser(id?: number | string): void {
    if (!id) return;
    if (!confirm('Delete this user?')) return;
    this.loading = true;
    this.userService.delete(id).subscribe({
      next: () => {
        this.loading = false;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user', err);
        alert('Failed to delete user.');
        this.loading = false;
      }
    });
  }

  toggleRole(role: string): void {
    const t = this.tempUser as User;
    if (!t.roles) t.roles = [];
    const i = t.roles.indexOf(role);
    if (i === -1) t.roles.push(role);
    else t.roles.splice(i, 1);
  }
}
