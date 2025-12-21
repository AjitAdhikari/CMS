import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCoursesComponent } from './pages/add-courses/add-courses.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeeMonitoringComponent } from './pages/fee-monitoring/fee-monitoring.component';
import { NoticeControlComponent } from './pages/notice-control/notice-control.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'add-courses', component: AddCoursesComponent },
  { path: 'fee-monitoring', component: FeeMonitoringComponent },
  { path: 'notice-control', component: NoticeControlComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
