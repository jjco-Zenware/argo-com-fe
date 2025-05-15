import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroCompraRoutingModule } from './registro-compra-routing.module';
import { CRegistroCompraComponent } from './c-registro-compra/c-registro-compra.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatoCompraComponent } from './c-dato-compra/c-dato-compra.component';
import { ProyectosService } from '../proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';
import { FieldsetModule } from 'primeng/fieldset';
import { AlmacenModule } from '../../almacen/almacen.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { CModalPersonaComponent } from './modalPersona/c-modalpersona.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { LibroDiarioModule } from '../../contabilidad/librodiario/librodiario.module';
import { MarketingService } from '../../marketing/service/marketingServices';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    CRegistroCompraComponent,
    DatoCompraComponent,
    CModalPersonaComponent
  ],
  imports: [
    CommonModule,
    RegistroCompraRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule ,
    AlmacenModule,
    InputNumberModule ,
    TagModule,
    RegistroProveedorModule,
    LibroDiarioModule,
    DropdownModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, ProyectosService, OrdencompraService, AlmacenService, MarketingService]
})
export class RegistroCompraModule { }
