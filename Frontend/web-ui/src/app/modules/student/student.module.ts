import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentRoutingModule } from './student-routing.module';
import { ScheduleComponent } from './pages/schedule/schedule.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
