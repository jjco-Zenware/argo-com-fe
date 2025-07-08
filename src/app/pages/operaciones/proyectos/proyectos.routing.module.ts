import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CProyectosComponent } from './c-proyectos/c-proyectos.component';

const routes: Routes = [
  {
    path:'',
    component: CProyectosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }