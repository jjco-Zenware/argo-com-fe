import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ProyectosService } from '../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../compras/Service/compraServices';
import { ToastModule } from 'primeng/toast';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { ContabilidadService } from './service/contabilidad.services';
import { LibroDiarioRoutingModule } from './librodiario/librodiario-routing.module';


@NgModule({
  declarations: [     
       
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ContabilidadRoutingModule,
    ToastModule
  ], 
  providers : [OrdencompraService, ComprasService,ProyectosService, ContabilidadService, SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class ContabilidadModule { }
