import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitacionRoutingModule } from './habitacion-routing.module';
import { CHabitacionListComponent } from './c-habitacion-list/c-habitacion-list.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { HabitacionesService } from './habitaciones.service';
import { SharedAppService } from '@sharedAppService';


@NgModule({
  declarations: [
    CHabitacionListComponent
  ],
  imports: [
    CommonModule,
    HabitacionRoutingModule,
    SharedPrimeNgModule
  ],
  providers: [HabitacionesService, SharedAppService]
})
export class HabitacionModule { }
