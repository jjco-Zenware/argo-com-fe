import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CReubicacionComponent } from './c-reubicacion/c-reubicacion.component';

const routes: Routes = [
  {
    path:'',
    component: CReubicacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReubicacionRoutingModule { }