import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentRoutingModule } from './student-routing.module';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NoticeComponent } from './pages/notice/notice.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ScheduleComponent,
    NoticeComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
