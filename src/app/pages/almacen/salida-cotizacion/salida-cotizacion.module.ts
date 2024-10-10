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
import { SalidaCotizacionRoutingModule } from './salida-cotizacion-routing.module';
import { CDetalleSalComponent } from './c-detallemovsal/c-detallemovsal.component';
import { CSalidaCotizacionComponent } from './c-listamovsal/c-listamovsal.component';
import { SplitButtonModule } from 'primeng/splitbutton';


@NgModule({
  declarations: [
    CSalidaCotizacionComponent,
    CDetalleSalComponent
  ],
  imports: [
    CommonModule,
    SalidaCotizacionRoutingModule,
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
export class SalidaCotizacionModule { }