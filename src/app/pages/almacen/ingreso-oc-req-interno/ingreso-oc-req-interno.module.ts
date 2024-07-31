import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcReqInternoRoutingModule } from './ingreso-oc-req-interno-routing.module';
import { CIngresoOcReqInternoComponent } from './c-ingreso-oc-req-interno/c-ingreso-oc-req-interno.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CIngresoOcReqInternoComponent
  ],
  imports: [
    CommonModule,
    IngresoOcReqInternoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class IngresoOcReqInternoModule { }
