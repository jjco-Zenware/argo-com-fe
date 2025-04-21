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
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { CNotaDebitoComponent } from './c-notadebito-lista/c-notadebito-lista.component';
import { CNotaDebitoDetComponent } from './c-notadebito-det/c-notadebito-det.component';
import { NotaDebitoRoutingModule } from './notadebito-routing.module';

@NgModule({
  declarations: [
    CNotaDebitoComponent,
    CNotaDebitoDetComponent
  ],
  imports: [
    CommonModule,
    NotaDebitoRoutingModule,
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
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, ProyectosService, OrdencompraService, AlmacenService, ContabilidadService]
})
export class NotaDebitoModule { }