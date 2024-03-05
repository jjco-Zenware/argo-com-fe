import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroCompraRoutingModule } from './registro-compra-routing.module';
import { CRegistroCompraComponent } from './c-registro-compra/c-registro-compra.component';


@NgModule({
  declarations: [
    CRegistroCompraComponent
  ],
  imports: [
    CommonModule,
    RegistroCompraRoutingModule
  ]
})
export class RegistroCompraModule { }
