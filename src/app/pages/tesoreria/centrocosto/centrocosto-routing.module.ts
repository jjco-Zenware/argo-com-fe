import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCentroCostoComponent } from './c-centro-lista/c-centrocosto.component';

const routes: Routes = [
    {
      path:'',
      component: CCentroCostoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroCostoRoutingModule { }