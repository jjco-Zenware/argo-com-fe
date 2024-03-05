import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'proyecto-ganado',
    loadChildren: () => import('./proyectos-ganados/proyectos-ganados.module').then(m => m.ProyectosGanadosModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'registro-facturacion',
    loadChildren: () => import('./registro-facturacion/registro-facturacion.module').then(m => m.RegistroFacturacionModule),
    data: { breadcrumb: 'Dashboard' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionRoutingModule { }
