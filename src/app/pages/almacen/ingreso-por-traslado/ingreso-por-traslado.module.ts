import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoPorTrasladoRoutingModule } from './ingreso-por-traslado-routing.module';
import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado/c-ingreso-por-traslado.component';


@NgModule({
  declarations: [
    CIngresoPorTrasladoComponent
  ],
  imports: [
    CommonModule,
    IngresoPorTrasladoRoutingModule
  ]
})
export class IngresoPorTrasladoModule { }
