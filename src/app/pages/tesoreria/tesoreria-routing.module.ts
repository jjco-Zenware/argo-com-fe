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
    data: { breadcrumb: 'cuentaporcobrar' }
  },
  {
    path: 'cuentaporpagar',
    loadChildren: () => import('./cuentaporpagar/cuentaporpagar.module').then(m => m.CuentaporPagarModule),
    data: { breadcrumb: 'cuentaporpagar' }
  },
  {
    path: 'flujocaja',
    loadChildren: () => import('./flujocaja/flujocaja.module').then(m => m.FlujocajaModule),
    data: { breadcrumb: 'flujocaja' }
  },
  {
    path: 'programacion',
    loadChildren: () => import('./programacion/programacion.module').then(m => m.ProgramacionModule),
    data: { breadcrumb: 'programacion' }
  },
  {
    path: 'importacion',
    loadChildren: () => import('./importacion/importacion.module').then(m => m.ImportacionModule),
    data: { breadcrumb: 'importacion' }
  },
  {
    path: 'conciliacion',
    loadChildren: () => import('./conciliacion/conciliacion.module').then(m => m.ConciliacionModule),
    data: { breadcrumb: 'conciliacion' }
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./movimientos/movimientos.module').then(m => m.MovimientosModule),
    data: { breadcrumb: 'movimientos' }
  },
  {
    path: 'cuentabanco',
    loadChildren: () => import('./cuentabanco/cuentabanco.module').then(m => m.CuentaBancoModule),
    data: { breadcrumb: 'cuentabanco' }
  },
  {
    path: 'centrocosto',
    loadChildren: () => import('./centrocosto/centrocosto.module').then(m => m.CentroCostoModule),
    data: { breadcrumb: 'cuentabanco' }
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
