import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRoomingListResumenComponent } from './c-rooming-list-resumen/c-rooming-list-resumen.component';

const routes: Routes = [
  {
    path: '',
    component: CRoomingListResumenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomingListResumenRoutingModule { }
