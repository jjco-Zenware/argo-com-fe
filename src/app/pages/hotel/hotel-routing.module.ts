import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'catalogo-habitaciones',
    loadChildren: () => import('./catalogo-habitacion/catalogo-habitacion.module').then(m => m.CatalogoHabitacionModule),
    data: { breadcrumb: 'Catalogo Habitaciones' }
  },
  {
    path: 'reserva',
    loadChildren: () => import('./reserva/reserva.module').then(m => m.ReservaModule),
    data: { breadcrumb: 'Reserva' }
  },
  {
    path: 'habitaciones',
    loadChildren: () => import('./habitacion/habitacion.module').then(m => m.HabitacionModule),
    data: { breadcrumb: 'Habitación' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
