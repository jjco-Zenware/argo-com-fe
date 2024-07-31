import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CSalidaVariosComponent } from './c-salida-varios/c-salida-varios.component';
import { SalidaVariosRoutingModule } from './salida-varios-routing.module';


@NgModule({
  declarations: [
    CSalidaVariosComponent
  ],
  imports: [
    CommonModule,
    SalidaVariosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class SalidaVariosModule { }