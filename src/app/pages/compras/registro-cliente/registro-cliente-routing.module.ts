import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroClienteComponent } from './c-registro-cliente/c-registro-cliente.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroClienteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroClienteRoutingModule { }