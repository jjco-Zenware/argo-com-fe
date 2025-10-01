import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ComprasService } from '../compras/Service/compraServices';
import { HotelRoutingModule } from './hotel-routing.module';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    HotelRoutingModule
  ],
  providers: [ComprasService]
})
export class HotelModule { }
