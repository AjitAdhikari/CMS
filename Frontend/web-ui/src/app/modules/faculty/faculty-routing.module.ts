import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GradesComponent } from './pages/grades/grades.component';
import { NotesComponent } from './pages/notes/notes.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'assignments', component: AssignmentsComponent },
  { path: 'grades', component: GradesComponent },
  { path: 'notices', component: NoticesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyRoutingModule { }
