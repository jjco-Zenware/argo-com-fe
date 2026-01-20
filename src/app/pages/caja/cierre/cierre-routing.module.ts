import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCierreListadoComponent } from './c-cierre-listado/c-cierre-listado.component';

const routes: Routes = [
  {
    path: '',
    component: CCierreListadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreRoutingModule { }
