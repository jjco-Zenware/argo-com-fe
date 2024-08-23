import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoPorTrasladoRoutingModule } from './ingreso-por-traslado-routing.module';
import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado/c-ingreso-por-traslado.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CDetalleMovTrasladoComponent } from './c-detallemovtraslado/c-detallemovtras.component';
import { AlmacenService } from '../service/almacenServices';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    CIngresoPorTrasladoComponent,
    CDetalleMovTrasladoComponent
  ],
  imports: [
    CommonModule,
    IngresoPorTrasladoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class IngresoPorTrasladoModule { }
