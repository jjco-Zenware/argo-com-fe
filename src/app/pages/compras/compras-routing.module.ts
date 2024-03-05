import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'proyecto-ganado',
    loadChildren: () => import('./proyectos-ganados/proyectos-ganados.module').then(m => m.ProyectosGanadosModule),
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'orden-compra-servicio',
    loadChildren: () => import('./orden-compra-servicio/orden-compra-servicio.module').then(m => m.OrdenCompraServicioModule),
    data: { breadcrumb: 'Dashboard' }
  },  
  {
    path: 'registro-compra',
    loadChildren: () => import('./registro-compra/registro-compra.module').then(m => m.RegistroCompraModule),
    data: { breadcrumb: 'Dashboard' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
