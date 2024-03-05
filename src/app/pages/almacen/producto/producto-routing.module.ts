import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CProductoComponent } from './c-producto/c-producto.component';

const routes: Routes = [
  {
    path:'',
    component: CProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
