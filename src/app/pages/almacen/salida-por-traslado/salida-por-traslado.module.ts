import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CSalidaTrasladoComponent } from './c-salida-por-traslado/c-salida-por-traslado.component';
import { SalidaTrasladoRoutingModule } from './salida-por-traslado-routing.module';


@NgModule({
  declarations: [
    CSalidaTrasladoComponent
  ],
  imports: [
    CommonModule,
    SalidaTrasladoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class SalidaTrasladoModule { }