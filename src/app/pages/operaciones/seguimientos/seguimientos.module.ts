import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SeguimientoRoutingModule } from './seguimientos.routing.module';
import { CSeguimientosComponent } from './c-seguimiento/c-seguimiento.component';


@NgModule({
  declarations: [
    CSeguimientosComponent
  ],
  imports: [
    CommonModule,
    SeguimientoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule,
    SelectButtonModule ,
    TagModule
  ],
  providers: [
    SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig,
    MessageService
    ]
})
export class SeguimientoModule { }