import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ingreso-oc-proyecto',
    loadChildren: () => import('./ingreso-oc-proyecto/ingreso-oc-proyecto.module').then(m => m.IngresoOcProyectoModule),
    data: { breadcrumb: 'Ingreso Compras' }
  },
  {
    path: 'ingreso-por-traslado',
    loadChildren: () => import('./ingreso-por-traslado/ingreso-por-traslado.module').then(m => m.IngresoPorTrasladoModule),
    data: { breadcrumb: 'Ingreso por Traslado' }
  },
  {
    path: 'ingreso-varios',
    loadChildren: () => import('./ingreso-varios/ingreso-varios.module').then(m => m.IngresoVariosModule),
    data: { breadcrumb: 'Ingreso Varios' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoRoutingModule { }
