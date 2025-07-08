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
import { PartidasRoutingModule } from './partidas.routing.module';
import { TagModule } from 'primeng/tag';
import { CPartidasComponent } from './c-partidas/c-partidas.component';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CModalProductoComponent } from './modal-producto/c-modal-producto.component';
import { ComprasService } from '../../compras/Service/compraServices';


@NgModule({
  declarations: [
    CPartidasComponent,
    CModalProductoComponent
  ],
  imports: [
    CommonModule,
    PartidasRoutingModule,
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
    ProyectosService,
    AlmacenService,
    ComprasService
    ]
})
export class PartidasModule { }