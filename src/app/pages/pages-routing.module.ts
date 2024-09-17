import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPagesComponent } from './c-pages.component';

const routes: Routes = [  
  {
    path: '',
    component: CPagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'compras',
        loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule),
        data: { breadcrumb: 'Compras' }
      },
      {
        path: 'facturacion',
        loadChildren: () => import('./facturacion/facturacion.module').then(m => m.FacturacionModule),
        data: { breadcrumb: 'Facturación' }
      },
      {
        path: 'almacen',
        loadChildren: () => import('./almacen/almacen.module').then(m => m.AlmacenModule),
        data: { breadcrumb: 'Almacén' }
      },
      {
        path: 'tesoreria',
        loadChildren: () => import('./tesoreria/tesoreria.module').then(m => m.TesoreriaModule),
        data: { breadcrumb: 'Tesoreria' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
