import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancoRoutingModule } from './banco-routing.module';
import { CBancoComponent } from './c-banco/c-banco.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CBancoDetalleComponent } from './c-banco-detalle/c-banco-detalle.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';

@NgModule({
  declarations: [
    CBancoComponent,
    CBancoDetalleComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    BancoRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, TesoreriaService, ContabilidadService]
})
export class BancoModule { }