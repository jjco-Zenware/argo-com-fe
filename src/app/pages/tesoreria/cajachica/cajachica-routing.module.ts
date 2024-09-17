import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCajachicaComponent } from './c-cajachica/c-cajachica.component';

const routes: Routes = [
    {
      path:'',
      component: CCajachicaComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajachicaRoutingModule { }