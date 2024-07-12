import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCotizacionComponent } from './c-cotizacion-cab/c-cotizacion-cab.component';

const routes: Routes = [
  {
    path:'',
    component: CCotizacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }