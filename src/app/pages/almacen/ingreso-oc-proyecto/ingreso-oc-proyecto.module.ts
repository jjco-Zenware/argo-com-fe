import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcProyectoRoutingModule } from './ingreso-oc-proyecto-routing.module';
import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto/c-ingreso-oc-proyecto.component';


@NgModule({
  declarations: [
    CIngresoOcProyectoComponent
  ],
  imports: [
    CommonModule,
    IngresoOcProyectoRoutingModule
  ]
})
export class IngresoOcProyectoModule { }
