import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenesRoutingModule } from './almacenes-routing.module';
import { CAlmacenesComponent } from './c-almacenes/c-almacenes.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CAlmacenesDetalleComponent } from './c-almacenes-detalle/c-almacenes-detalle.component';
import { AlmacenService } from '../service/almacenServices';


@NgModule({
  declarations: [
    CAlmacenesComponent,
    CAlmacenesDetalleComponent
  ],
  imports: [
    CommonModule,
    AlmacenesRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class AlmacenesModule { }
