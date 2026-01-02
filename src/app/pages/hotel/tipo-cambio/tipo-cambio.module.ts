import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoCambioRoutingModule } from './tipo-cambio-routing.module';
import { CTipoCambioComponent } from './c-tipo-cambio/c-tipo-cambio.component';
import { CTipoCambioDatoComponent } from './c-tipo-cambio-dato/c-tipo-cambio-dato.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TipoCambioService } from './tipo-cambio.service';


@NgModule({
  declarations: [
    CTipoCambioComponent,
    CTipoCambioDatoComponent
  ],
  imports: [
    CommonModule,
    TipoCambioRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    InputNumberModule,
    TagModule,
    DropdownModule,
  ],
  providers: [
    SharedAppService,
    DynamicDialogRef,
    DynamicDialogConfig,
    TipoCambioService
  ]
})
export class TipoCambioModule { }
