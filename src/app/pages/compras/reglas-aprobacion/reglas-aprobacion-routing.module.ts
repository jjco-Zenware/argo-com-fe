import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReglasAprobacionComponent } from './c-reglas-aprobacion/c-reglas-aprobacion.component';

const routes: Routes = [
  {
    path:'',
    component: ReglasAprobacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReglaAprobacionRoutingModule { }