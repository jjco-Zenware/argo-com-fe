import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { CMantenimientoListadoComponent } from './c-mantenimiento-listado/c-mantenimiento-listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { ReservaService } from '../../hotel/reserva/reserva.service';
import { CmMantenimientoCajaComponent } from './cm-mantenimiento-caja/cm-mantenimiento-caja.component';


@NgModule({
  declarations: [
    CMantenimientoListadoComponent,
    CmMantenimientoCajaComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
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
export class MantenimientoModule { }
