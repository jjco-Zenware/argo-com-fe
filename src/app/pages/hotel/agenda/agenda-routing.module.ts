import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAgendaComponent } from './c-agenda/c-agenda.component';

const routes: Routes = [
  {
    path:'',
    component: CAgendaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
