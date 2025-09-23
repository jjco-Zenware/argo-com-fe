import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto/c-ingreso-oc-proyecto.component';

const routes: Routes = [
  {
    path:'',
    component: CIngresoOcProyectoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoOcProyectoRoutingModule { }
