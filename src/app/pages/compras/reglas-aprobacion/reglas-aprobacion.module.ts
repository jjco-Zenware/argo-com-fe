import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReglasAprobacionComponent } from './c-reglas-aprobacion/c-reglas-aprobacion.component';
import { ReglaAprobacionRoutingModule } from './reglas-aprobacion-routing.module';
import { DetalleComponent } from './c-detalle/c-detalle.component';


@NgModule({
  declarations: [
    ReglasAprobacionComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    ReglaAprobacionRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class ReglaAprobacionModule { }