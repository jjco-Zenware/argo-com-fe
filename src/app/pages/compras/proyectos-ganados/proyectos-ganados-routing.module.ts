import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CProyectosGanadosComponent } from './c-proyectos-ganados/c-proyectos-ganados.component';

const routes: Routes = [
  {
    path:'',
    component: CProyectosGanadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosGanadosRoutingModule { }
