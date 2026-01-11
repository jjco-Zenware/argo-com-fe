import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MovSalidaRoutingModule } from './mov-salida-routing.module';
import { CMovSalidaListadoComponent } from './c-mov-salida-listado/c-mov-salida-listado.component';
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
    CMovSalidaListadoComponent
  ],
  imports: [
    CommonModule,
    MovSalidaRoutingModule,
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
export class MovSalidaModule { }
