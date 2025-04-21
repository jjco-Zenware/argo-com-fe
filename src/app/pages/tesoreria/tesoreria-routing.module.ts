import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'banco',
    loadChildren: () => import('./banco/banco.module').then(m => m.BancoModule),
    data: { breadcrumb: 'Banco' }
  },
  {
    path: 'cajachica',
    loadChildren: () => import('./cajachica/cajachica.module').then(m => m.CajachicaModule),
    data: { breadcrumb: 'cajachica' }
  },
  {
    path: 'cuentaporcobrar',
    loadChildren: () => import('./cuentaporcobrar/cuentaporcobrar.module').then(m => m.CuentaporCobrarModule),
    data: { breadcrumb: 'Cuentas por Cobrar' }
  },
  {
    path: 'cuentaporpagar',
    loadChildren: () => import('./cuentaporpagar/cuentaporpagar.module').then(m => m.CuentaporPagarModule),
    data: { breadcrumb: 'Cuentas por Pagar' }
  },
  {
    path: 'flujocaja',
    loadChildren: () => import('./flujocaja/flujocaja.module').then(m => m.FlujocajaModule),
    data: { breadcrumb: 'Flujo de Caja' }
  },
  {
    path: 'programacion',
    loadChildren: () => import('./programacion/programacion.module').then(m => m.ProgramacionModule),
    data: { breadcrumb: 'programacion' }
  },
  {
    path: 'importacion',
    loadChildren: () => import('./importacion/importacion.module').then(m => m.ImportacionModule),
    data: { breadcrumb: 'Importación De Cuentas' }
  },
  {
    path: 'conciliacion',
    loadChildren: () => import('./conciliacion/conciliacion.module').then(m => m.ConciliacionModule),
    data: { breadcrumb: 'Conciliación' }
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./movimientos/movimientos.module').then(m => m.MovimientosModule),
    data: { breadcrumb: 'Movimientos de Bancos' }
  },
  {
    path: 'cuentabanco',
    loadChildren: () => import('./cuentabanco/cuentabanco.module').then(m => m.CuentaBancoModule),
    data: { breadcrumb: 'Cuentas de Bancos' }
  },
  {
    path: 'centrocosto',
    loadChildren: () => import('./centrocosto/centrocosto.module').then(m => m.CentroCostoModule),
    data: { breadcrumb: 'Centros de Costo' }
  },
  {
    path: 'pagosprogramados',
    loadChildren: () => import('./pagosprogramados/pagosprogramados.module').then(m => m.PagosProgramadosModule),
    data: { breadcrumb: 'Pagos Programados' }
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
