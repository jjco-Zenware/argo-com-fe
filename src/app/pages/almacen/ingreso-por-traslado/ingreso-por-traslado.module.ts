import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoPorTrasladoRoutingModule } from './ingreso-por-traslado-routing.module';
import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado/c-ingreso-por-traslado.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CIngresoPorTrasladoComponent
  ],
  imports: [
    CommonModule,
    IngresoPorTrasladoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class IngresoPorTrasladoModule { }
