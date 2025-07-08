import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [     
       
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    OperacionesRoutingModule,
    ToastModule
  ],  
  providers : [ SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class OperacionesModule { }