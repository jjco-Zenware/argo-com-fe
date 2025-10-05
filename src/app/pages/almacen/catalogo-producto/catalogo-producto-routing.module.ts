import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCatalogoProductoComponent } from './c-catalogo-producto/c-catalogo-producto.component';

const routes: Routes = [
  {
    path:'',
    component: CCatalogoProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoProductoRoutingModule { }
