import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPuntoVentaListadoComponent } from './c-punto-venta-listado/c-punto-venta-listado.component';

const routes: Routes = [
  {
    path: '',
    component: CPuntoVentaListadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoVentaRoutingModule { }
