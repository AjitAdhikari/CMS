import { Component } from '@angular/core';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent {

  assignments = [
    {
      title: 'Project Euler - Problem 1',
      course: 'CS 101',
      status: 'Submitted',
      dueDate: '2025-11-20'
    },
    {
      title: 'Quantum Mechanics Lab Report',
      course: 'PHY 205',
      status: 'Pending',
      dueDate: '2025-12-05'
    },
    {
      title: 'Marketing Strategy Analysis',
      course: 'BUS 301',
      status: 'Overdue',
      dueDate: '2025-11-10'
    }
  ];

  statusClass(status: string): string {
    return status.toLowerCase();
  }

}
