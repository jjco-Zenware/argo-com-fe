import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'reserva',
    loadChildren: () => import('./reserva/reserva.module').then(m => m.ReservaModule),
    data: { breadcrumb: 'Reserva' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
