import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../service/almacenServices';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CSalidaOcReqComponent } from './c-listamovsal/c-listamovsal.component';
import { CDetalleOcReqComponent } from './c-detallemovsal/c-detallemovsal.component';
import { SalidaOcReqRoutingModule } from './salida-oc-req-interno-routing.module';


@NgModule({
  declarations: [
    CSalidaOcReqComponent,
    CDetalleOcReqComponent
  ],
  imports: [
    CommonModule,
    SalidaOcReqRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class SalidaOcReqModule { }