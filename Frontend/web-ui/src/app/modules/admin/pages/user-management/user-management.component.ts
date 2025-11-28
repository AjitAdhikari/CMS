import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  status: 'Active' | 'Inactive';
  semester?: number;
  subject?: string;
  activity?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: string[] = ['Admin', 'Student', 'Faculty'];

  // UI state
  showForm = false;
  editing = false;
  currentAddRole: 'Admin' | 'Student' | 'Faculty' = 'Admin';
  tempUser: Partial<User> = {};
  searchTerm = '';
  roleFilter = 'Admin';

  private nextId = 4;

  ngOnInit(): void {
    // sample data
    this.users = [
      { id: 1, name: 'David Lee', email: 'david.lee@example.com', roles: ['Admin'], status: 'Active' },
      { id: 2, name: 'Sara Powell', email: 'sara.powell@example.com', roles: ['Student'], status: 'Active', semester: 2, activity: 'Online' },
      { id: 3, name: 'Mark Chan', email: 'mark.chan@example.com', roles: ['Faculty'], status: 'Inactive', subject: 'Mathematics' }
    ];
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(u => {
      const matchesTerm = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchesRole = !this.roleFilter || u.roles.includes(this.roleFilter);
      return matchesTerm && matchesRole;
    });
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
    if (role === 'Faculty') this.tempUser.subject = '';
    this.showForm = true;
  }

  openAddCurrent(): void {
    // open add form for the currently selected role tab
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

    if (this.editing) {
      const idx = this.users.findIndex(u => u.id === t.id);
      if (idx > -1) {
        const original = this.users[idx];
        const updated: User = {
          id: original.id,
          name: t.name,
          email: t.email,
          roles: original.roles,
          status: t.status || original.status,
          semester: original.semester,
          subject: original.subject
        };
        if ((t as any).semester !== undefined) updated.semester = (t as any).semester;
        if ((t as any).subject !== undefined) updated.subject = (t as any).subject;
        this.users[idx] = updated;
      }
    } else {
      const role = this.currentAddRole || (this.roleFilter as 'Admin' | 'Student' | 'Faculty');
      const newUser: User = {
        id: this.nextId++,
        name: t.name,
        email: t.email,
        roles: [role],
        status: t.status || 'Active',
        semester: role === 'Student' ? ((t as any).semester || 1) : undefined,
        subject: role === 'Faculty' ? ((t as any).subject || '') : undefined
      };
      this.users.unshift(newUser);
    }

    this.closeForm();
  }

  deleteUser(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this user?')) return;
    this.users = this.users.filter(u => u.id !== id);
  }

  toggleRole(role: string): void {
    const t = this.tempUser as User;
    if (!t.roles) t.roles = [];
    const i = t.roles.indexOf(role);
    if (i === -1) t.roles.push(role);
    else t.roles.splice(i, 1);
  }
}
