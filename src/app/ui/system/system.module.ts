import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Projects from '@ui/system/projects';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  declarations: [Projects.ProjectsComponent, Projects.ProjectsListComponent, Projects.ProjectDetailsComponent],
  imports: [
    CommonModule,
    SystemRoutingModule
  ]
})
export class SystemModule {
 }
