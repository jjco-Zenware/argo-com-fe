import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomingListResumenRoutingModule } from './rooming-list-resumen-routing.module';
import { CRoomingListResumenComponent } from './c-rooming-list-resumen/c-rooming-list-resumen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { HotelService } from '../produccion/hotel.service';


@NgModule({
  declarations: [
    CRoomingListResumenComponent
  ],
  imports: [
    CommonModule,
    RoomingListResumenRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    HotelService
  ]
})
export class RoomingListResumenModule { }
