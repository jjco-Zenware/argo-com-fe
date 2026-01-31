import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningReservaRoutingModule } from './planning-reserva-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { AlmacenModule } from '../../almacen/almacen.module';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService } from 'primeng/api';
import { ReservaService } from '../reserva/reserva.service';
import { ReservaModule } from '../reserva/reserva.module';
import { HabitacionesService } from '../habitacion/habitaciones.service';
import { CPlanningReservaComponent } from './c-planning-reserva/c-planning-reserva.component';


@NgModule({
  declarations: [
    CPlanningReservaComponent
  ],
  imports: [
    CommonModule,
    PlanningReservaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule ,
    AlmacenModule,
    InputNumberModule ,
    TagModule,
    DropdownModule,
    ReservaModule,
  ],
  providers: [
    SharedAppService, 
    ConfirmationService,
    ReservaService,
    HabitacionesService
  ]
})
export class PlanningReservaModule { }
