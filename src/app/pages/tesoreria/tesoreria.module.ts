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


@NgModule({
  declarations: [     
       
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    TesoreriaRoutingModule
  ],
  providers : [OrdencompraService, ComprasService,ProyectosService, AlmacenService]
})
export class TesoreriaModule { }
