import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentRoutingModule } from './student-routing.module';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { FeesComponent } from './pages/fees/fees.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { ResultsComponent } from './pages/results/results.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ScheduleComponent,
    NoticeComponent,
    FeesComponent,
    AssignmentsComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
