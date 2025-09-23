import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'salida-varios',
    loadChildren: () => import('./salida-varios/salida-varios.module').then(m => m.SalidaVariosModule),
    data: { breadcrumb: 'Salida Varios' }
  },
  {
    path: 'salida-por-traslado',
    loadChildren: () => import('./salida-por-traslado/salida-por-traslado.module').then(m => m.SalidaTrasladoModule),
    data: { breadcrumb: 'Salida por Traslado' }
  },
  {
    path: 'salida-oc-proyecto',
    loadChildren: () => import('./salida-oc-proyecto/salida-oc-proyecto.module').then(m => m.SalidaOcProyectoModule),
    data: { breadcrumb: 'Salida por Ventas' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaRoutingModule { }
