import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAperturaCierreListadoComponent } from './c-apertura-cierre-listado/c-apertura-cierre-listado.component';

const routes: Routes = [
  {
    path: '',
    component: CAperturaCierreListadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AperturaCierreRoutingModule { }
