import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosService } from '../proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';
import { FieldsetModule } from 'primeng/fieldset';
import { AlmacenModule } from '../../almacen/almacen.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { ReporteCompraRoutingModule } from './reporte-compra-routing.module';
import { CReporteCompraComponent } from './c-reporte-compra/c-reporte-compra.component';
import { ModalCompraComponent } from './c-modal-compra/c-modal-compra.component';

@NgModule({
  declarations: [
    CReporteCompraComponent,
    ModalCompraComponent
  ],
  imports: [
    CommonModule,
    ReporteCompraRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule ,
    AlmacenModule,
    InputNumberModule ,
    TagModule,
    RegistroProveedorModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, ProyectosService, OrdencompraService, AlmacenService]
})
export class ReporteCompraModule { }
