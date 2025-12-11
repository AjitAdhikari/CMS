import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigInitService } from './appconfig.init';
import { JwtInterceptor } from './JwtInterceptor';
import { AdminSidebarComponent } from './modules/admin/components/admin-sidebar/admin-sidebar.component';
import { HeaderModule } from './modules/admin/components/header/header.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { LayoutModule } from './modules/layout/layout.module';
import { MemberModule } from './modules/member/member.module';
import { StudentSidebarComponent } from './modules/student/components/student-sidebar/student-sidebar.component';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { DocumentModule } from './modules/document/document.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SettingModule } from './modules/setting/setting.module';



export function init_app(appLoadService: AppConfigInitService) {
  return () => appLoadService.init();
}
@NgModule({
  declarations: [
    AppComponent,
    AdminSidebarComponent,
    StudentSidebarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HeaderModule,
    AuthModule,
    InventoryModule,
    MemberModule,
    LayoutModule,
    DocumentModule,
    FinanceModule,
    SettingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    AppConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppConfigInitService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
