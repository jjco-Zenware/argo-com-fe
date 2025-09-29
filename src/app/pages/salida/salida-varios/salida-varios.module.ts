import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CSalidaVariosComponent } from './c-salida-varios/c-salida-varios.component';
import { SalidaVariosRoutingModule } from './salida-varios-routing.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ComprasService } from '../../compras/Service/compraServices';
import { MessageService } from 'primeng/api';
import { CDetalleMovSalComponent } from './c-detallemovsal/c-detallemovsal.component';
import { AlmacenService } from '../../almacen/service/almacenServices';


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
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, ComprasService, MessageService]
})
export class SalidaVariosModule { }