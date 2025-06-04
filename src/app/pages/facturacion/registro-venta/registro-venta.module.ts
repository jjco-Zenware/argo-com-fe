import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { AlmacenModule } from '../../almacen/almacen.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { CRegistroVentaComponent } from './c-registro-venta/c-registro-venta.component';
import { DatoVentaComponent } from './c-dato-venta/c-dato-venta.component';
import { RegistroVentaRoutingModule } from './registro-venta-routing.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    CRegistroVentaComponent,
    DatoVentaComponent
  ],
  imports: [
    CommonModule,
    RegistroVentaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule ,
    AlmacenModule,
    InputNumberModule ,
    TagModule,
    RegistroProveedorModule,
    DropdownModule 
  ],
  providers: [
    SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig, 
    ProyectosService, 
    OrdencompraService, 
    AlmacenService, 
    ContabilidadService,
    ConfirmationService
  ]
})
export class RegistroVentaModule { }