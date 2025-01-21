import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMovimientosComponent } from './c-movimientos/c-movimientos.component';

const routes: Routes = [
    {
      path:'',
      component: CMovimientosComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }