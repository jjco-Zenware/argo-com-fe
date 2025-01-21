import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CActivosComponent } from './c-activos/c-activos.component';

const routes: Routes = [
    {
      path:'',
      component: CActivosComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivosRoutingModule { }