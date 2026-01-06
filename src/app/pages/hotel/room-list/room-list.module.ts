import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomListRoutingModule } from './room-list-routing.module';
import { CRoomListComponent } from './c-room-list/c-room-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { HotelService } from '../produccion/hotel.service';


@NgModule({
  declarations: [
    CRoomListComponent
  ],
  imports: [
    CommonModule,
    RoomListRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    HotelService
  ]
})
export class RoomListModule { }
