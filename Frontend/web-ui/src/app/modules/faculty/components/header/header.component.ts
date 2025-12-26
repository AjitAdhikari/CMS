import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StorageHelper from 'src/app/helpers/StorageHelper';

@Component({
  selector: 'app-faculty-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName = 'User';
  time: string = '';
  date: string = '';
  userRole: string = 'faculty';
  private timerId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTime();
    this.timerId = setInterval(() => this.updateTime(), 1000);
    this.getUserRole();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  private updateTime(): void {
    const now = new Date();
    this.time = now.toLocaleTimeString();
    this.date = now.toLocaleDateString();
  }

  private getUserRole(): void {
    const stored = StorageHelper.getLocalStorageItem('_user_details');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const urlPath = this.router.url;
        if (urlPath.includes('/admin')) {
          this.userRole = 'admin';
        } else if (urlPath.includes('/student')) {
          this.userRole = 'student';
        } else if (urlPath.includes('/faculty')) {
          this.userRole = 'faculty';
        }
      } catch (e) {
        this.userRole = 'faculty';
      }
    }
  }

  getSettingsRoute(): string {
    if (this.userRole === 'student') {
      return '/student/setting';
    } else if (this.userRole === 'faculty') {
      return '/faculty/setting';
    }
    return '/admin/setting';
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['app-login']);
  }
}
