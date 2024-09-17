import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBancoComponent } from './c-banco/c-banco.component';

const routes: Routes = [
    {
      path:'',
      component: CBancoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancoRoutingModule { }