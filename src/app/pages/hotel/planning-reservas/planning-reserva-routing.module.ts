import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPlanningReservaComponent } from './c-planning-reserva/c-planning-reserva.component';

const routes: Routes = [
  {
    path:'',
    component: CPlanningReservaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningReservaRoutingModule { }
