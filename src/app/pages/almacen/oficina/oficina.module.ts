import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../service/almacenServices';
import { COficinaDetalleComponent } from './c-oficina-detalle/c-oficina-detalle.component';
import { COficinaComponent } from './c-oficina/c-oficina.component';
import { OficinaRoutingModule } from './oficina-routing.module';


@NgModule({
  declarations: [
    COficinaComponent,
    COficinaDetalleComponent
  ],
  imports: [
    CommonModule,
    OficinaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class OficinaModule { }