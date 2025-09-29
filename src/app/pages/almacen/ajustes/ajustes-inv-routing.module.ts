import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAjustescabComponent } from './c-ajustescab-inv/c-ajustescab.component';

const routes: Routes = [
  {
    path:'',
    component: CAjustescabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesInvRoutingModule { }
