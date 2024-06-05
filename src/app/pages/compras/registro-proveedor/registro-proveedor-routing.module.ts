import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRegistroProveedorComponent } from './c-registro-proveedor/c-registro-proveedor.component';

const routes: Routes = [
  {
    path:'',
    component: CRegistroProveedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroProveedorRoutingModule { }