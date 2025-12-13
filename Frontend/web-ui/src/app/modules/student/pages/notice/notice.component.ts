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
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {
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
      body: 'New research grants are available. Students interested should submit proposals by the end of this month.',
      date: '2025-10-10'
    },
    {
      id: 4,
      source: 'Admin',
      title: 'Assignment Submission Deadline',
      body: 'All assignments for mid-term must be submitted by December 15. Late submissions will incur a 10% penalty.',
      date: '2025-12-01'
    },
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
