import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcReqInternoRoutingModule } from './ingreso-oc-req-interno-routing.module';
import { CIngresoOcReqInternoComponent } from './c-ingreso-oc-req-interno/c-ingreso-oc-req-interno.component';


@NgModule({
  declarations: [
    CIngresoOcReqInternoComponent
  ],
  imports: [
    CommonModule,
    IngresoOcReqInternoRoutingModule
  ]
})
export class IngresoOcReqInternoModule { }
