import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoOcReqInternoRoutingModule } from './ingreso-oc-req-interno-routing.module';
import { CIngresoOcReqInternoComponent } from './c-ingreso-oc-req-interno/c-ingreso-oc-req-interno.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../service/almacenServices';
import { CDetalleMovInterComponent } from './c-detallemovinterno/c-detallemovinter.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';


@NgModule({
  declarations: [
    CIngresoOcReqInternoComponent,
    CDetalleMovInterComponent
  ],
  imports: [
    CommonModule,
    IngresoOcReqInternoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    SelectButtonModule,
    TagModule,
    RegistroProveedorModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class IngresoOcReqInternoModule { }
