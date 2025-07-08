import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPartidasComponent } from './c-partidas/c-partidas.component';

const routes: Routes = [
  {
    path:'',
    component: CPartidasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidasRoutingModule { }