import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoPorTrasladoRoutingModule } from './ingreso-por-traslado-routing.module';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado/c-ingreso-por-traslado.component';
import { CDetalleMovTrasladoComponent } from './c-detallemovtraslado/c-detallemovtras.component';
import { AlmacenService } from '../../almacen/service/almacenServices';


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
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class IngresoPorTrasladoModule { }
