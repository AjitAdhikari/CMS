import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { FeeMonitoringComponent } from './pages/fee-monitoring/fee-monitoring.component';
import { NoticeControlComponent } from './pages/notice-control/notice-control.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserManagementComponent,
    FeeMonitoringComponent,
    NoticeControlComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
