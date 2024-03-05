import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenDespachoRoutingModule } from './orden-despacho-routing.module';
import { COrdenDespachoComponent } from './c-orden-despacho/c-orden-despacho.component';


@NgModule({
  declarations: [
    COrdenDespachoComponent
  ],
  imports: [
    CommonModule,
    OrdenDespachoRoutingModule
  ]
})
export class OrdenDespachoModule { }
