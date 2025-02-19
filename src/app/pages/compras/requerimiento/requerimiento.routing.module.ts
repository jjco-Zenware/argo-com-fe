import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRequerimientoComponent } from './c-requerimiento-cab/c-requerimiento-cab.component';

const routes: Routes = [
  {
    path:'',
    component: CRequerimientoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRoutingModule { }