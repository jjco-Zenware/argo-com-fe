import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLiquidacionListComponent } from './liquidacion-list/c-liquidacion-list.component';

const routes: Routes = [
  {
    path: '',
    component: CLiquidacionListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionRoutingModule { }
