import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCompraServicioRoutingModule } from './orden-compra-servicio-routing.module';
import { COrdenCompraServicioComponent } from './c-orden-compra-servicio/c-orden-compra-servicio.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CabeceraocComponent } from './cabeceraoc/cabeceraoc.component';
import { DetalleocComponent } from './detalleoc/detalleoc.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../proyectos-ganados/proyectos-ganados.module';


@NgModule({
  declarations: [
    COrdenCompraServicioComponent,
    CabeceraocComponent,
    DetalleocComponent
  ],
  imports: [
    CommonModule,
    OrdenCompraServicioRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class OrdenCompraServicioModule { }
