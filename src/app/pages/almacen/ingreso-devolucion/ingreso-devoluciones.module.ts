import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IngresosDevolucionesRoutingModule } from './ingreso-devoluciones-routing.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AlmacenService } from '../service/almacenServices';
import { CIngresosDevolucionesComponent } from './c-ingreso-devoluciones/c-ingreso-devoluciones.component';
import { CDetalleDevolucionComponent } from './c-detalle-devoluciones/c-detalledevoluciones.component';


@NgModule({
  declarations: [
    CIngresosDevolucionesComponent,
    CDetalleDevolucionComponent
  ],
  imports: [
    CommonModule,
    IngresosDevolucionesRoutingModule,
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
export class IngresoDevolucionesModule { }
