import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMovProductoComponent } from './c-movProducto/c-movProducto.component';

const routes: Routes = [
  {
    path:'',
    component: CMovProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovProductoRoutingModule { }
