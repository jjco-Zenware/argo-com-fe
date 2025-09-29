import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado/c-ingreso-por-traslado.component';

const routes: Routes = [
  {
    path:'',
    component: CIngresoPorTrasladoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoPorTrasladoRoutingModule { }
