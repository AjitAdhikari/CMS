import { Component } from '@angular/core';

type NoticeSource = 'University' | 'Admin';

interface Notice {
  id: number;
  source: NoticeSource;
  title: string;
  body: string;
  date: string;
}

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent {
  selectedSource: NoticeSource = 'University';
  selectedNotice: Notice | null = null;

  notices: Notice[] = [
    {
      id: 1,
      source: 'University',
      title: 'Semester Start Date Announced',
      body: 'The new semester will begin on September 1. Please check your course schedules and register accordingly.',
      date: '2025-09-01'
    },
    {
      id: 2,
      source: 'Admin',
      title: 'System Maintenance',
      body: 'There will be planned maintenance on the student portal this Saturday between 02:00-05:00.',
      date: '2025-11-15'
    },
    {
      id: 3,
      source: 'University',
      title: 'Research Grant Opportunities',
      body: 'New research grants are available. Faculty members interested should submit proposals by the end of this month.',
      date: '2025-10-10'
    },
    {
      id: 4,
      source: 'Admin',
      title: 'Office Hours Change',
      body: 'Administration office hours will change to 9am-4pm starting next week.',
      date: '2025-12-01'
    }
  ];

  setSource(source: NoticeSource) {
    this.selectedSource = source;
    this.selectedNotice = null;
  }

  viewNotice(n: Notice) {
    this.selectedNotice = n;
  }

  closeNotice() {
    this.selectedNotice = null;
  }

  get filteredNotices(): Notice[] {
    return this.notices.filter(n => n.source === this.selectedSource);
  }
}
