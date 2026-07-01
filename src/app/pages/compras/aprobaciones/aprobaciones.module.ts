import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../proyectos-ganados/proyectos-ganados.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { CAprobacionComponent } from './c-aprobacion/c-aprobacion.component';
import { AprobacionRoutingModule } from './aprobaciones-routing.module';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';
import { CDetalleComponent } from './c-detalle/c-detalle.component';
import { SharedAppModule } from '../../../shared/shared-App.module';




@NgModule({
  declarations: [
    CAprobacionComponent,
    CDetalleComponent
  ],
  imports: [
    CommonModule,
    AprobacionRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule,
    SplitButtonModule,
    RegistroProveedorModule,
    SelectButtonModule,
    TagModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, OrdencompraService]
})
export class AprobacionModule { }