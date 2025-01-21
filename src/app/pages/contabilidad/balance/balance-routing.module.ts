import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBalanceComponent } from './c-balance/c-balance.component';

const routes: Routes = [
    {
      path:'',
      component: CBalanceComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceRoutingModule { }