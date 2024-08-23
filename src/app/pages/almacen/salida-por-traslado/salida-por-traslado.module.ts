import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CSalidaTrasladoComponent } from './c-salida-por-traslado/c-salida-por-traslado.component';
import { SalidaTrasladoRoutingModule } from './salida-por-traslado-routing.module';
import { CDetalleMovSalTrasladoComponent } from './c-detallemovsaltras/c-detallemovsaltras.component';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { AlmacenService } from '../service/almacenServices';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    CSalidaTrasladoComponent,
    CDetalleMovSalTrasladoComponent
  ],
  imports: [
    CommonModule,
    SalidaTrasladoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class SalidaTrasladoModule { }