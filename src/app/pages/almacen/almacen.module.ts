import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../compras/proyectos-ganados/proyectos-ganados.module';
import { OrdencompraService } from '../compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../compras/Service/compraServices';
import { TableModule } from 'primeng/table';
import { CItemOrdenesComponent } from './items-ordenes/c-items-ordenes.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CBusquedaProductoComponent } from './busqueda-producto/c-busqueda-producto.component';


@NgModule({
  declarations: [
    CItemOrdenesComponent,
    CBusquedaProductoComponent
  ],
  imports: [
    CommonModule,
    AlmacenRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule,
    TableModule,
    CheckboxModule
    
  ],
  providers : [OrdencompraService, ComprasService]
})
export class AlmacenModule { }
