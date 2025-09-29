import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcProyectoRoutingModule } from './ingreso-oc-proyecto-routing.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto/c-ingreso-oc-proyecto.component';
import { CDetalleMovComponent } from './c-detallemov/c-detallemov.component';
import { AlmacenService } from '../../almacen/service/almacenServices';


@NgModule({
  declarations: [
    CIngresoOcProyectoComponent,
    CDetalleMovComponent   
  ],
  imports: [
    CommonModule,
    IngresoOcProyectoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    SelectButtonModule,
    TagModule,
    RegistroProveedorModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, OrdencompraService]
})
export class IngresoOcProyectoModule { }
