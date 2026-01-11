import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMovEntradaListadoComponent } from './c-mov-entrada-listado/c-mov-entrada-listado.component';

const routes: Routes = [
    {
      path:'',
      component: CMovEntradaListadoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovEntradaRoutingModule { }
