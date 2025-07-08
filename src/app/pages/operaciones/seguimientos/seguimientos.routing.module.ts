import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSeguimientosComponent } from './c-seguimiento/c-seguimiento.component';

const routes: Routes = [
  {
    path:'',
    component: CSeguimientosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoRoutingModule { }