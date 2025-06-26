import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CResultadoComponent } from './c-resultado/c-resultado.component';

const routes: Routes = [
    {
      path:'',
      component: CResultadoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadoRoutingModule { }