import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'eventos',
    loadChildren: () => import('./eventos/evento.module').then(m => m.EventoModule),
    data: { breadcrumb: 'Eventos' }
  },
  {
    path: 'fondos',
    loadChildren: () => import('./fondos/fondo.module').then(m => m.FondosModule),
    data: { breadcrumb: 'Fondos' }
  },
  {
    path: 'RegistroParticipantes',
    loadChildren: () => import('./participantes/registroParticipantes.module').then(m => m.ParticipanteModule),
    data: { breadcrumb: 'Participantes' }
  }

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }