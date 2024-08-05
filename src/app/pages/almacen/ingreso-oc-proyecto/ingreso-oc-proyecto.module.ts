import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcProyectoRoutingModule } from './ingreso-oc-proyecto-routing.module';
import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto/c-ingreso-oc-proyecto.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { AlmacenService } from '../service/almacenServices';


@NgModule({
  declarations: [
    CIngresoOcProyectoComponent   
  ],
  imports: [
    CommonModule,
    IngresoOcProyectoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    SelectButtonModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class IngresoOcProyectoModule { }
