import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIngresosDevolucionesComponent } from './c-ingreso-devoluciones/c-ingreso-devoluciones.component';

const routes: Routes = [
  {
    path:'',
    component: CIngresosDevolucionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosDevolucionesRoutingModule { }
