import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CConciliacionComponent } from './c-conciliacion/c-conciliacion.component';

const routes: Routes = [
    {
      path:'',
      component: CConciliacionComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliacionRoutingModule { }