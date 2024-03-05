import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COrdenDespachoComponent } from './c-orden-despacho/c-orden-despacho.component';

const routes: Routes = [
  {
    path:'',
    component: COrdenDespachoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenDespachoRoutingModule { }
