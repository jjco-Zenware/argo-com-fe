import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CInformeGastosComponent } from './c-infogastos-lista/c-infogastos.component';

const routes: Routes = [
  {
    path:'',
    component: CInformeGastosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeGastosRoutingModule { }