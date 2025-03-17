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
import { CSalidaOcProyectoComponent } from './c-listamovsal/c-listamovsal.component';
import { CDetalleSalOcProyComponent } from './c-detallemovsal/c-detallemovsal.component';
import { SalidaOcProyectoRoutingModule } from './salida-oc-proyecto-routing.module';


@NgModule({
  declarations: [
    CSalidaOcProyectoComponent,
    CDetalleSalOcProyComponent
  ],
  imports: [
    CommonModule,
    SalidaOcProyectoRoutingModule,
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
export class SalidaOcProyectoModule { }