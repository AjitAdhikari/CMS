import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '../layout/layout.module';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderModule } from './components/header/header.module';
import { AddCoursesComponent } from './pages/add-courses/add-courses.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeeMonitoringComponent } from './pages/fee-monitoring/fee-monitoring.component';
import { NoticeControlComponent } from './pages/notice-control/notice-control.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserManagementComponent,
    FeeMonitoringComponent,
    NoticeControlComponent,
    AddCoursesComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule
  ]
  
})
export class AdminModule { }
