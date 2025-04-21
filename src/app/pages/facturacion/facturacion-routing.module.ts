import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'proyecto-ganado',
    loadChildren: () => import('./proyectos-ganados/proyectos-ganados.module').then(m => m.ProyectosGanadosModule),
    data: { breadcrumb: 'Proyecto Ganado' }
  },
  {
    path: 'registro-facturacion',
    loadChildren: () => import('./registro-facturacion/registro-facturacion.module').then(m => m.RegistroFacturacionModule),
    data: { breadcrumb: 'Registro Factura' }
  },
  {
    path: 'registro-cliente',
    loadChildren: () => import('./registro-cliente/registro-cliente.module').then(m => m.RegistroClienteModule),
    data: { breadcrumb: 'Registro Cliente' }
  },
  {
    path: 'registro-venta',
    loadChildren: () => import('./registro-venta/registro-venta.module').then(m => m.RegistroVentaModule),
    data: { breadcrumb: 'Registro Venta' }
  },
  {
    path: 'reporte-venta',
    loadChildren: () => import('./reporte-venta/reporte-venta.module').then(m => m.ReporteVentaModule),
    data: { breadcrumb: 'Reporte Venta' }
  },
  {
    path: 'notacredito',
    loadChildren: () => import('./notacredito/notacredito.module').then(m => m.NotaCreditoModule),
    data: { breadcrumb: 'Nota de crédito' }
  },
  {
    path: 'notadebito',
    loadChildren: () => import('./notadebito/notadebito.module').then(m => m.NotaDebitoModule),
    data: { breadcrumb: 'Nota de Débito' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionRoutingModule { }
