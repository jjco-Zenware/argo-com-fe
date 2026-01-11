import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAperturaListadoComponent } from './c-apertura-listado/c-apertura-listado.component';

const routes: Routes = [
  {
    path:'',
    component: CAperturaListadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AperturaRoutingModule { }
