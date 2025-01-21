import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CProgramacionComponent } from './c-programacion/c-programacion.component';

const routes: Routes = [
    {
      path:'',
      component: CProgramacionComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramacionRoutingModule { }