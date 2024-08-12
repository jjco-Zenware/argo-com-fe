import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KardexRoutingModule } from './kardex-routing.module';
import { CKardexComponent } from './c-kardex/c-kardex.component';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [
    CKardexComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class KardexModule { }
