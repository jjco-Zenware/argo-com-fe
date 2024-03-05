import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ingreso-oc-proyecto',
    loadChildren: () => import('./ingreso-oc-proyecto/ingreso-oc-proyecto.module').then(m => m.IngresoOcProyectoModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'ingreso-oc-interno',
    loadChildren: () => import('./ingreso-oc-req-interno/ingreso-oc-req-interno.module').then(m => m.IngresoOcReqInternoModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'orden-despacho',
    loadChildren: () => import('./orden-despacho/orden-despacho.module').then(m => m.OrdenDespachoModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'productos',
    loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'almacenes',
    loadChildren: () => import('./almacenes/almacenes.module').then(m => m.AlmacenesModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'kardex',
    loadChildren: () => import('./kardex/kardex.module').then(m => m.KardexModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'ingreso-por-traslado',
    loadChildren: () => import('./ingreso-por-traslado/ingreso-por-traslado.module').then(m => m.IngresoPorTrasladoModule),
    data: { breadcrumb: 'Dashboard' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
