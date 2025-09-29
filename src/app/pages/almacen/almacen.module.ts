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
import { ProyectosService } from '../compras/proyectos-ganados/service/proyectos.service';
import { CItemAlmacenComponent } from './c-item-almacen/c-item-almacen.component';
import { CModalUbicacionComponent } from './modal-ubicacion/modal-ubicacion.component';
import { TreeModule } from 'primeng/tree';
import { ContabilidadService } from '../contabilidad/service/contabilidad.services';


@NgModule({
  declarations: [
    CItemOrdenesComponent,
    CBusquedaProductoComponent,
    CItemAlmacenComponent,
    CModalUbicacionComponent
    
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
    CheckboxModule,
    TreeModule
    
  ],
  exports: [
    CItemOrdenesComponent,
    CBusquedaProductoComponent,
    CItemAlmacenComponent,
    CModalUbicacionComponent
  ],
  providers : [OrdencompraService, ComprasService, ProyectosService, ContabilidadService]
})
export class AlmacenModule { }
