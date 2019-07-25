import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as Projects from '@ui/system/projects';
import { CanDeactivateGuard } from '@ui/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'System'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects'
      },
      {
        path: 'projects',
        component: Projects.ProjectsComponent,
        data: {
          title: 'Projects'
        },
        children: [
          { path: '', component: Projects.ProjectsListComponent },
          {
            path: 'new',
            component: Projects.ProjectDetailsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Create Project'
            }
          },
          {
            path: ':id',
            component: Projects.ProjectDetailsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit Project'
            }
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
