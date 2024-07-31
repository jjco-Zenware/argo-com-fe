import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcProyectoRoutingModule } from './ingreso-oc-proyecto-routing.module';
import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto/c-ingreso-oc-proyecto.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CDetalleComponent } from '../detalles/detalle.component';


@NgModule({
  declarations: [
    CIngresoOcProyectoComponent,
    CDetalleComponent
  ],
  imports: [
    CommonModule,
    IngresoOcProyectoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class IngresoOcProyectoModule { }
