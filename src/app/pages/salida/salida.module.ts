import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../compras/proyectos-ganados/proyectos-ganados.module';
import { OrdencompraService } from '../compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../compras/Service/compraServices';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ProyectosService } from '../compras/proyectos-ganados/service/proyectos.service';
import { TreeModule } from 'primeng/tree';
import { ContabilidadService } from '../contabilidad/service/contabilidad.services';
import { AlmacenModule } from '../almacen/almacen.module';
import { SalidaRoutingModule } from './salida-routing.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    SalidaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule,
    TableModule,
    CheckboxModule,
    TreeModule,  
    AlmacenModule
  ],
  providers : [OrdencompraService, ComprasService, ProyectosService, ContabilidadService]
})
export class SalidaModule { }
