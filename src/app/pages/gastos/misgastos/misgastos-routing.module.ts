import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroMisGastosComponent } from './c-registro-misgastos/c-registro-misgastos.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroMisGastosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisGastosRoutingModule { }