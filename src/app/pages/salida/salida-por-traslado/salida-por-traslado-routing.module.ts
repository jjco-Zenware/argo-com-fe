import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaTrasladoComponent } from './c-salida-por-traslado/c-salida-por-traslado.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaTrasladoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaTrasladoRoutingModule { }