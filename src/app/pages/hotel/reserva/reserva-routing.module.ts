import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CReservaListComponent } from './c-reserva-list/c-reserva-list.component';

const routes: Routes = [
  {
    path:'',
    component: CReservaListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaRoutingModule { }
