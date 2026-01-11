import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { AlmacenModule } from '../../almacen/almacen.module';
import { HotelService } from './hotel.service';
import { LiquidacionRoutingModule } from './liquidacion-routing.module';
import { CLiquidacionListComponent } from './liquidacion-list/c-liquidacion-list.component';


@NgModule({
  declarations: [
    CLiquidacionListComponent
  ],
  imports: [
    CommonModule,
    LiquidacionRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    AlmacenModule,
    InputNumberModule,
    TagModule,
    DropdownModule,
  ],
  providers: [HotelService]
})
export class LiquidacionModule { }
