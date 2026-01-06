import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRoomListComponent } from './c-room-list/c-room-list.component';

const routes: Routes = [
  {
    path: '',
    component: CRoomListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomListRoutingModule { }
