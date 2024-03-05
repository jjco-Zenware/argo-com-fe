import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COrdenCompraServicioComponent } from './c-orden-compra-servicio/c-orden-compra-servicio.component';

const routes: Routes = [
  {
    path:'',
    component: COrdenCompraServicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenCompraServicioRoutingModule { }
