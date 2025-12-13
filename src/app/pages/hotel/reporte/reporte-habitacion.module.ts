import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteHabitacionRoutingModule } from './reporte-habitacion-routing.module';
import { CRptHabitacionComponent } from './c-rpt-habitacion/c-rpt-habitacion.component';
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


@NgModule({
  declarations: [
    CRptHabitacionComponent
  ],
  imports: [
    CommonModule,
    ReporteHabitacionRoutingModule,
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
export class ReporteHabitacionModule { }
