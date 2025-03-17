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
import { CFondoComponent } from './c-fondo/c-fondo.component';
import { FondoRoutingModule } from './fondo-routing.module';
import { CModalFondoComponent } from './c-modal-fondo/c-modal-fondo.component';

@NgModule({
  declarations: [
    CFondoComponent,
    CModalFondoComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FondoRoutingModule,
    TagModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, MarketingService, ComprasService ]
})
export class FondosModule { }