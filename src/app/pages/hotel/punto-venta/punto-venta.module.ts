import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PuntoVentaRoutingModule } from './punto-venta-routing.module';
import { CPuntoVentaListadoComponent } from './c-punto-venta-listado/c-punto-venta-listado.component';
import { CPuntoVentaDatoComponent } from './c-punto-venta-dato/c-punto-venta-dato.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ComprasModule } from '../../compras/compras.module';
import { FacturacionModule } from '../../facturacion/facturacion.module';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { ReservaService } from '../reserva/reserva.service';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { SharedAppService } from '@sharedAppService';

@NgModule({
  declarations: [
    CPuntoVentaListadoComponent,
    CPuntoVentaDatoComponent
  ],
  imports: [
    CommonModule,
    PuntoVentaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ComprasModule,
    FacturacionModule,
  ],
  providers: [
    DatePipe,
    ProyectosService,
    OrdencompraService,
    ContabilidadService,
    ReservaService,
    AlmacenService,
    SharedAppService
  ]
})
export class PuntoVentaModule { }
