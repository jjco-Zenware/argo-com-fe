import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNotaCreditoComponent } from './c-notacredito-lista/c-notacredito-lista.component';

const routes: Routes = [
  {
    path:'',
    component: CNotaCreditoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotaCreditoRoutingModule { }
