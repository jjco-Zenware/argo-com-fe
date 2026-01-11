import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MovEntradaRoutingModule } from './mov-entrada-routing.module';
import { CMovEntradaListadoComponent } from './c-mov-entrada-listado/c-mov-entrada-listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { ReservaService } from '../../hotel/reserva/reserva.service';


@NgModule({
  declarations: [
    CMovEntradaListadoComponent
  ],
  imports: [
    CommonModule,
    MovEntradaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
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
export class MovEntradaModule { }
