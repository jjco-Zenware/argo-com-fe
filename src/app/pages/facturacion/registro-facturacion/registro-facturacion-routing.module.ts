import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroFacturacionComponent } from './c-registro-facturacion/c-registro-facturacion.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroFacturacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroFacturacionRoutingModule { }
