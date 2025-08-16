import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'proyecto-ganado',
    loadChildren: () => import('./proyectos-ganados/proyectos-ganados.module').then(m => m.ProyectosGanadosModule),
    data: { breadcrumb: 'proyectos-ganados' }
  },
  {
    path: 'orden-compra-servicio',
    loadChildren: () => import('./orden-compra-servicio/orden-compra-servicio.module').then(m => m.OrdenCompraServicioModule),
    data: { breadcrumb: 'Orden de Compra/Servicios' }
  },
  {
    path: 'registro-compra',
    loadChildren: () => import('./registro-compra/registro-compra.module').then(m => m.RegistroCompraModule),
    data: { breadcrumb: 'Registros de Compras' }
  },
  {
    path: 'registro-proveedor',
    loadChildren: () => import('./registro-proveedor/registro-proveedor.module').then(m => m.RegistroProveedorModule),
    data: { breadcrumb: 'Registros de Proveedores' }
  },
  {
    path: 'reglas-aprobacion',
    loadChildren: () => import('./reglas-aprobacion/reglas-aprobacion.module').then(m => m.ReglaAprobacionModule),
    data: { breadcrumb: 'Reglas de Aprobación' }
  },
  {
    path: 'aprobaciones',
    loadChildren: () => import('./aprobaciones/aprobaciones.module').then(m => m.AprobacionModule),
    data: { breadcrumb: 'Aprobaciones' }
  },
  {
    path: 'cotizacion',
    loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule),
    data: { breadcrumb: 'Aprobaciones' }
  },
  {
    path: 'reporte-compra',
    loadChildren: () => import('./reporte-compra/reporte-compra.module').then(m => m.ReporteCompraModule),
    data: { breadcrumb: 'Reporte de Compras' }
  },
  {
    path: 'requerimiento',
    loadChildren: () => import('./requerimiento/requerimiento.module').then(m => m.RequerimientoModule),
    data: { breadcrumb: 'requerimiento' }
  },
  {
    path: 'reporte-consolidado',
    loadChildren: () => import('./reporte-consolidado/reporte-consolidado.module').then(m => m.ReporteConsolidadoModule),
    data: { breadcrumb: 'Reporte Consolidado de Compras' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
