import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCargamasivaComponent } from './c-cargamasiva/c-cargamasiva.component';

const routes: Routes = [
  {
    path:'',
    component: CCargamasivaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargamasivaRoutingModule { }