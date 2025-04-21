import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPagosProComponent } from './c-pagospro/c-pagospro.component';

const routes: Routes = [
    {
      path:'',
      component: CPagosProComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosProgramadosRoutingModule { }