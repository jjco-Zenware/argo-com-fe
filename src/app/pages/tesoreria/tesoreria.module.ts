import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { ProyectosService } from '../compras/proyectos-ganados/service/proyectos.service';
import { AlmacenService } from '../almacen/service/almacenServices';
import { OrdencompraService } from '../compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../compras/Service/compraServices';
import { ToastModule } from 'primeng/toast';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [     
       
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    TesoreriaRoutingModule,
    ToastModule
  ],  
  providers : [OrdencompraService, ComprasService,ProyectosService, AlmacenService, SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class TesoreriaModule { }
