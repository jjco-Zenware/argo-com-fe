import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCuentaporCobrarComponent } from './c-cuentaporcobrar/c-cuentaporcobrar.component';

const routes: Routes = [
    {
      path:'',
      component: CCuentaporCobrarComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaporCobrarRoutingModule { }