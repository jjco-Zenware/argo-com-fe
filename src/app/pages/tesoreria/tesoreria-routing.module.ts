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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
