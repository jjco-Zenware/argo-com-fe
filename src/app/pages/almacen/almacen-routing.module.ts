import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ingreso-oc-proyecto',
    loadChildren: () => import('./ingreso-oc-proyecto/ingreso-oc-proyecto.module').then(m => m.IngresoOcProyectoModule),
    data: { breadcrumb: 'Ingreso por Compras' }
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
    data: { breadcrumb: 'Ingreso por Transferencia' }
  },
  {
    path: 'ingreso-varios',
    loadChildren: () => import('./ingreso-varios/ingreso-varios.module').then(m => m.IngresoVariosModule),
    data: { breadcrumb: 'Ingresos' }
  },
  {
    path: 'salida-varios',
    loadChildren: () => import('./salida-varios/salida-varios.module').then(m => m.SalidaVariosModule),
    data: { breadcrumb: 'Salidas Por Consumo' }
  },
  {
    path: 'salida-por-traslado',
    loadChildren: () => import('./salida-por-traslado/salida-por-traslado.module').then(m => m.SalidaTrasladoModule),
    data: { breadcrumb: 'Salida por Transferencia' }
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./catalogo/catalogo.module').then(m => m.CatalogoModule),
    data: { breadcrumb: 'Catalogo' }
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
    data: { breadcrumb: 'Stock' }
  },
  {
    path: 'grupo',
    loadChildren: () => import('./grupo/grupo.module').then(m => m.GrupoModule),
    data: { breadcrumb: 'Grupo/Categoría' }
  },
  {
    path: 'salida-cotizacion',
    loadChildren: () => import('./salida-cotizacion/salida-cotizacion.module').then(m => m.SalidaCotizacionModule),
    data: { breadcrumb: 'Salida Cotización' }
  },
  {
    path: 'oficina',
    loadChildren: () => import('./oficina/oficina.module').then(m => m.OficinaModule),
    data: { breadcrumb: 'Oficina' }
  },
  {
    path: 'salida-oc-proyecto',
    loadChildren: () => import('./salida-oc-proyecto/salida-oc-proyecto.module').then(m => m.SalidaOcProyectoModule),
    data: { breadcrumb: 'Salida Por Ventas' }
  },
  {
    path: 'salida-oc-req-interno',
    loadChildren: () => import('./salida-oc-req-interno/salida-oc-req-interno.module').then(m => m.SalidaOcReqModule),
    data: { breadcrumb: 'salida-oc-re-interno' }
  },
  {
    path: 'movProducto',
    loadChildren: () => import('./movProducto/movProducto.module').then(m => m.MovProductoModule),
    data: { breadcrumb: 'Movimientos de Producto' }
  },
  {
    path: 'ingreso-devolucion',
    loadChildren: () => import('./ingreso-devolucion/ingreso-devoluciones.module').then(m => m.IngresoDevolucionesModule),
    data: { breadcrumb: 'Ingresos por Devoluciones' }
  },
  {
    path: 'salida-baja',
    loadChildren: () => import('./salida-baja/salida-baja.module').then(m => m.SalidaBajaModule),
    data: { breadcrumb: 'Salida Por Baja' }
  },
  {
    path: 'reubicacion',
    loadChildren: () => import('./reubicacion/reubicacion.module').then(m => m.ReubicacionModule),
    data: { breadcrumb: 'Reubicacion' }
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes-inv.module').then(m => m.AjustesInvModule),
    data: { breadcrumb: 'Ajustes de Inventario' }
  },
  {
    path: 'guia-remision',
    loadChildren: () => import('./guia-remision/guia-remision.module').then(m => m.GuiaRemisionModule),
    data: { breadcrumb: 'Guía de Remisión' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
