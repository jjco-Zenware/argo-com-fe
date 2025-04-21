import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CModalParticipanteComponent } from './registroParticipantes/c-modalparticipante.component';

const routes: Routes = [
    {
      path:'',
      component: CModalParticipanteComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipanteRoutingModule { }