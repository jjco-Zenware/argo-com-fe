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
  },
  {
    path: 'listar-produccion-hotel',
    loadChildren: () => import('./produccion/produccion.module').then(m => m.ProduccionModule),
    data: { breadcrumb: 'Producción' }
  },
  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule),
    data: { breadcrumb: 'Agenda' }
  },
  {
    path: 'planning-reservas',
    loadChildren: () => import('./reporte/reporte-habitacion.module').then(m => m.ReporteHabitacionModule),
    data: { breadcrumb: 'Reporte Habitación' }
  },
  {
    path: 'tipo-cambio',
    loadChildren: () => import('./tipo-cambio/tipo-cambio.module').then(m => m.TipoCambioModule),
    data: { breadcrumb: 'Tipo Cambio' }
  },
    {
    path: 'room-list-hotel',
    loadChildren: () => import('./room-list/room-list.module').then(m => m.RoomListModule),
    data: { breadcrumb: 'Room List Hotel' }
  },
  {
    path:'listar-liquidacion-hotel',
    loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule),
    data: { breadcrumb: 'Liquidacion' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
