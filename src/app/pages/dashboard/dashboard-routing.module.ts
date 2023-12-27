import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CDashboardComponent } from './c-dashboard/c-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
