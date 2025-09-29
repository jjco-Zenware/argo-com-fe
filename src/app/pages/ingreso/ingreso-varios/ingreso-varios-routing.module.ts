import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIngresosVariosComponent } from './c-ingreso-varios/c-ingreso-varios.component';

const routes: Routes = [
  {
    path:'',
    component: CIngresosVariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosVariosRoutingModule { }
