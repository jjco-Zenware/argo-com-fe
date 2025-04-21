

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { TagModule } from 'primeng/tag';
import { MarketingService } from '../service/marketingServices';
import { ComprasService } from '../../compras/Service/compraServices';
import { CModalParticipanteComponent } from './registroParticipantes/c-modalparticipante.component';
import { ParticipanteRoutingModule } from './registroParticipantes-routing.module';

@NgModule({
  declarations: [
    CModalParticipanteComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ParticipanteRoutingModule,
    TagModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, MarketingService, ComprasService ]
})
export class ParticipanteModule { }