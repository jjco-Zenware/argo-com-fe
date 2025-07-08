import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProyectosRoutingModule } from './proyectos.routing.module';
import { TagModule } from 'primeng/tag';
import { CProyectosComponent } from './c-proyectos/c-proyectos.component';
import { CProyectosDetComponent } from './c-proyectos-det/c-proyectosdet.component';
import { ComprasService } from '../../compras/Service/compraServices';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { CModalProveedorComponent } from './modal-proveedor/c-modalproveedor.component';
import { AlmacenService } from '../../almacen/service/almacenServices';


@NgModule({
  declarations: [
    CProyectosComponent,
    CProyectosDetComponent,
    CModalProveedorComponent
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule,
    SelectButtonModule ,
  ],
  providers: [
    SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig,
    MessageService,
    ComprasService,
    OrdencompraService,
    ProyectosService,
    AlmacenService,
    DatePipe
    ]
})
export class ProyectosModule { }