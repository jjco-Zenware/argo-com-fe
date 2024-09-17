import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCuentaporPagarComponent } from './c-cuentaporpagar/c-cuentaporpagar.component';

const routes: Routes = [
    {
      path:'',
      component: CCuentaporPagarComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaporPagarRoutingModule { }