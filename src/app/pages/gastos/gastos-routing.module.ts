import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'infogastos',
    loadChildren: () => import('./infogastos/infogastos.module').then(m => m.InformeGastosModule),
    data: { breadcrumb: 'Informe de Gastos' }
  },
  {
    path: 'misgastos',
    loadChildren: () => import('./misgastos/misgastos.module').then(m => m.MisGastosModule),
    data: { breadcrumb: 'Mis Gastos' }
  },
//   {
//     path: 'RegistroParticipantes',
//     loadChildren: () => import('./participantes/registroParticipantes.module').then(m => m.ParticipanteModule),
//     data: { breadcrumb: 'Participantes' }
//   }

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }