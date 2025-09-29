import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CGuiaRemisionListaComponent } from './c-guia-lista/c-guialista.component';

const routes: Routes = [
  {
    path:'',
    component: CGuiaRemisionListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuiaRemisionRoutingModule { }