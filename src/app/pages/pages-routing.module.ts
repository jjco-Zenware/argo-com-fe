import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPagesComponent } from './c-pages.component';

const routes: Routes = [  
  {
    path: '',
    component: CPagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
