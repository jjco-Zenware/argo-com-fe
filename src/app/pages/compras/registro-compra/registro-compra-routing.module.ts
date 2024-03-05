import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroCompraComponent } from './c-registro-compra/c-registro-compra.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroCompraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroCompraRoutingModule { }
