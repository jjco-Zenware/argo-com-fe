import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'apertura-cajas',
    loadChildren: () => import('./apertura/apertura.module').then(m => m.AperturaModule)
  },
  {
    path: 'cierre-cajas',
    loadChildren: () => import('./cierre/cierre.module').then(m => m.CierreModule)
  },
  {
    path: 'crud-cajas',
    loadChildren: () => import('./mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule)
  },
  {
    path: 'mov-entrada-cajas',
    loadChildren: () => import('./mov-entrada/mov-entrada.module').then(m => m.MovEntradaModule)
  },
  {
    path: 'mov-salida-cajas',
    loadChildren: () => import('./mov-salida/mov-salida.module').then(m => m.MovSalidaModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
