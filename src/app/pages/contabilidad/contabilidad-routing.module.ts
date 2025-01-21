import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: 'balance',
      loadChildren: () => import('./balance/balance.module').then(m => m.BalanceModule),
      data: { breadcrumb: 'Balance Comprobación' }
    },
  {
    path: 'librodiario',
    loadChildren: () => import('./librodiario/librodiario.module').then(m => m.LibroDiarioModule),
    data: { breadcrumb: 'Libro Diario' }
  },
  {
    path: 'libromayor',
    loadChildren: () => import('./libromayor/libromayor.module').then(m => m.LibroMayorModule),
    data: { breadcrumb: 'Libro Mayor' }
  },
  {
    path: 'libroventas',
    loadChildren: () => import('./libroventas/libroventas.module').then(m => m.LibroVentasModule),
    //loadChildren: () => import('./libroventas/libroventas.module').then(m => m.LibroVentasModule),
    data: { breadcrumb: 'LE-Ventas' }
  },
  {
    path: 'librocompras',
    loadChildren: () => import('./librocompras/librocompras.module').then(m => m.LibroComprasModule),
    data: { breadcrumb: 'LE-Compras' }
  },
  {
    path: 'eeff',
    loadChildren: () => import('./eeff/eeff.module').then(m => m.EstadosFinancierosModule),
    data: { breadcrumb: 'Estados Financieros' }
  },
  {
    path: 'activos',
    loadChildren: () => import('./activos/activos.module').then(m => m.ActivosModule),
    data: { breadcrumb: 'Activos' }
  },
  {
    path: 'plancontable',
    loadChildren: () => import('./plancontable/plancontable.module').then(m => m.PlanContableModule),
    data: { breadcrumb: 'Plan Contable' }
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }