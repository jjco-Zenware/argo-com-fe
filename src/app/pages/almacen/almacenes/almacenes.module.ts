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
import { TreeModule } from 'primeng/tree';
import { CModalUbicacionComponent } from './c-modal-ubicacion/c-modalubicacion.component';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
  declarations: [
    CAlmacenesComponent,
    CAlmacenesDetalleComponent,
    CModalUbicacionComponent
  ],
  imports: [
    CommonModule,
    AlmacenesRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    TagModule,
    TimelineModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class AlmacenesModule { }
