import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ingreso-oc-proyecto',
    loadChildren: () => import('./ingreso-oc-proyecto/ingreso-oc-proyecto.module').then(m => m.IngresoOcProyectoModule),
    data: { breadcrumb: 'Ingreso OC Proyecto' }
  },
  {
    path: 'ingreso-oc-req-interno',
    loadChildren: () => import('./ingreso-oc-req-interno/ingreso-oc-req-interno.module').then(m => m.IngresoOcReqInternoModule),
    data: { breadcrumb: 'Ingreso OC Interno' }
  },
  {
    path: 'orden-despacho',
    loadChildren: () => import('./orden-despacho/orden-despacho.module').then(m => m.OrdenDespachoModule),
    data: { breadcrumb: 'Orden Despacho' }
  },
  {
    path: 'productos',
    loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
    data: { breadcrumb: 'Productos' }
  },
  {
    path: 'almacenes',
    loadChildren: () => import('./almacenes/almacenes.module').then(m => m.AlmacenesModule),
    data: { breadcrumb: 'Almacenes' }
  },
  {
    path: 'kardex',
    loadChildren: () => import('./kardex/kardex.module').then(m => m.KardexModule),
    data: { breadcrumb: 'Kardeex' }
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
  },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
