import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IngresosVariosRoutingModule } from './ingreso-varios-routing.module';
import { CIngresosVariosComponent } from './c-ingreso-varios/c-ingreso-varios.component';


@NgModule({
  declarations: [
    CIngresosVariosComponent
  ],
  imports: [
    CommonModule,
    IngresosVariosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class IngresoVariosModule { }
