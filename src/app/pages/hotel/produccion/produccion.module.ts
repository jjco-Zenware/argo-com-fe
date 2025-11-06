import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProduccionRoutingModule } from './produccion-routing.module';
import { CProduccionListComponent } from './c-produccion-list/c-produccion-list.component';
import { HotelService } from './hotel.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { AlmacenModule } from '../../almacen/almacen.module';


@NgModule({
  declarations: [
    CProduccionListComponent
  ],
  imports: [
    CommonModule,
    ProduccionRoutingModule,
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
export class ProduccionModule { }
