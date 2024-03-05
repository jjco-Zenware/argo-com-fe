import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCompraServicioRoutingModule } from './orden-compra-servicio-routing.module';
import { COrdenCompraServicioComponent } from './c-orden-compra-servicio/c-orden-compra-servicio.component';


@NgModule({
  declarations: [
    COrdenCompraServicioComponent
  ],
  imports: [
    CommonModule,
    OrdenCompraServicioRoutingModule
  ]
})
export class OrdenCompraServicioModule { }
