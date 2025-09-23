import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaBajaComponent } from './c-salida-baja/c-salida-baja.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaBajaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaBajaRoutingModule { }