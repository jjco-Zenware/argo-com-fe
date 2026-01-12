import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService } from 'primeng/api';
import { CajaService } from './caja.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CajaRoutingModule
  ],
  providers: [
    SharedAppService,
    ConfirmationService,
    CajaService
  ]
})
export class CajaModule { }
