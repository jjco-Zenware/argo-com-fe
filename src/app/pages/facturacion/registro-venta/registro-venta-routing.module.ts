import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroVentaComponent } from './c-registro-venta/c-registro-venta.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroVentaRoutingModule { }
