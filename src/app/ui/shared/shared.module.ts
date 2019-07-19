import { NgModule } from '@angular/core';
// import { MaterialModule } from '@ui/material.module';
// import { SharedComponentsModule } from './components/components.module';
// import { LoginComponent } from './login/login.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import {
  AppAsideModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule
} from '@coreui/angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    // SharedComponentsModule,
    // MaterialModule,
    AppAsideModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [DefaultLayoutComponent],
  exports: [DefaultLayoutComponent]
})
export class SharedModule {}
