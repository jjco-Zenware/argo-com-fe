import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAprobacionComponent } from './c-aprobacion/c-aprobacion.component';

const routes: Routes = [
  {
    path:'',
    component: CAprobacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionRoutingModule { }