import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CDetalleBajaComponent } from './c-detallebaja/c-detallebaja.component';
import { AlmacenService } from '../service/almacenServices';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ComprasService } from '../../compras/Service/compraServices';
import { MessageService } from 'primeng/api';
import { CSalidaBajaComponent } from './c-salida-baja/c-salida-baja.component';
import { SalidaBajaRoutingModule } from './salida-baja-routing.module';


@NgModule({
  declarations: [
    CSalidaBajaComponent,
    CDetalleBajaComponent
  ],
  imports: [
    CommonModule,
    SalidaBajaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, ComprasService, MessageService]
})
export class SalidaBajaModule { }