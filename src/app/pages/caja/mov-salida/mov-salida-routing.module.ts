import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMovSalidaListadoComponent } from './c-mov-salida-listado/c-mov-salida-listado.component';

const routes: Routes = [
  {
    path:'',
    component: CMovSalidaListadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovSalidaRoutingModule { }
