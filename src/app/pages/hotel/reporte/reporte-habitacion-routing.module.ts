import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRptHabitacionComponent } from './c-rpt-habitacion/c-rpt-habitacion.component';

const routes: Routes = [
  {
    path:'',
    component: CRptHabitacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteHabitacionRoutingModule { }
