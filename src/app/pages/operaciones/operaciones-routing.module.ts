import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'partidas',
    loadChildren: () => import('./partidas/partidas.module').then(m => m.PartidasModule),
    data: { breadcrumb: 'Partidas de Servicios' }
  },
  {
    path: 'proyectos',
    loadChildren: () => import('./proyectos/proyectos.module').then(m => m.ProyectosModule),
    data: { breadcrumb: 'Proyectos de Partidas' }
  },
  {
    path: 'seguimientos',
    loadChildren: () => import('./seguimientos/seguimientos.module').then(m => m.SeguimientoModule),
    data: { breadcrumb: 'Seguimientos' }
  }

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }