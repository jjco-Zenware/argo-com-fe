import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CEventoComponent } from './c-evento/c-evento.component';

const routes: Routes = [
    {
      path:'',
      component: CEventoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }