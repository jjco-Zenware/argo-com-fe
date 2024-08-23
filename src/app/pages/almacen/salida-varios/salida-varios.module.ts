import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CSalidaVariosComponent } from './c-salida-varios/c-salida-varios.component';
import { SalidaVariosRoutingModule } from './salida-varios-routing.module';
import { CDetalleMovSalComponent } from './c-detallemovsal/c-detallemovsal.component';
import { AlmacenService } from '../service/almacenServices';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    CSalidaVariosComponent,
    CDetalleMovSalComponent
  ],
  imports: [
    CommonModule,
    SalidaVariosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class SalidaVariosModule { }