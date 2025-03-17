import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ToastModule } from 'primeng/toast';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MarketingRoutingModule } from './marketing-routing.module';


@NgModule({
  declarations: [     
       
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingRoutingModule,
    ToastModule
  ],  
  providers : [ SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class MarketingModule { }