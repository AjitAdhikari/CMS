import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from 'src/app/components/shared/breadcrumb/breadcrumb.component';
import { FooterComponent } from 'src/app/components/shared/footer/footer.component';
import { HeaderComponent } from 'src/app/components/shared/header/header.component';
import { LoaderComponent } from 'src/app/components/shared/loader/loader.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    LoaderComponent,
    
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    LoaderComponent,
    
  ],
  imports: [
    CommonModule,
    
  ]
})
export class LayoutModule { }
