import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CEstadosFinancierosComponent } from './c-eeff/c-eeff.component';

const routes: Routes = [
    {
      path:'',
      component: CEstadosFinancierosComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadosFinancierosRoutingModule { }