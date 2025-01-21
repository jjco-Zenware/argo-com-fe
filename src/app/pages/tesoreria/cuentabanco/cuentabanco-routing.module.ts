import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCuentaBancoComponent } from './c-cuentabanco/c-cuentabanco.component';

const routes: Routes = [
    {
      path:'',
      component: CCuentaBancoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaBancoRoutingModule { }