import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitacionRoutingModule } from './habitacion-routing.module';
import { CHabitacionListComponent } from './c-habitacion-list/c-habitacion-list.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { HabitacionesService } from './habitaciones.service';
import { SharedAppService } from '@sharedAppService';
import { CModalExcTransacHotelComponent } from './modal-exc-transac-hotel/modal-exc-transac-hotel.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CmReservaHabitacionComponent } from './cm-reserva-habitacion/cm-reserva-habitacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { AlmacenModule } from '../../almacen/almacen.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { ReservaModule } from '../reserva/reserva.module';
import { HotelModule } from '../hotel.module';
import { CmTransferenciaReservaComponent } from './cm-transferencia-reserva/cm-transferencia-reserva.component';


@NgModule({
  declarations: [
    CHabitacionListComponent,
    CModalExcTransacHotelComponent,
    CmReservaHabitacionComponent,
    CmTransferenciaReservaComponent
  ],
  imports: [
    CommonModule,
    HabitacionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeNgModule,
    FieldsetModule,
    AlmacenModule,
    InputNumberModule,
    TagModule,
    RegistroProveedorModule,
    DropdownModule,
    ReservaModule,
    HotelModule
  ],
  providers: [HabitacionesService, SharedAppService, ConfirmationService, MessageService]
})
export class HabitacionModule { }
