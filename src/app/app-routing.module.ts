import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './ui/shared';
import { TestComponent } from './ui/test/test.component';
import { Test2Component } from './ui/test2/test2.component';

// export const routes: Routes = [
//   {
//     path: '',
//     component: DefaultLayoutComponent,
//     data: {
//       title: 'Home'
//     },
//     children: [
//       {
//         path: 'dashboard',
//         component: TestComponent
//       },
//       {
//         path: 'colors',
//         component: Test2Component
//       }
//     ]
//   }
// ];

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component:TestComponent,
        data: {
          title: 'dashboard'
        }
      },
      {
        path: 'system',
        loadChildren: '@ui/system/system.module#SystemModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
