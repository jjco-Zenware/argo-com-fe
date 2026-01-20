import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AperturaRoutingModule } from './apertura-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CAperturaListadoComponent } from './c-apertura-listado/c-apertura-listado.component';


@NgModule({
  declarations: [
    CAperturaListadoComponent
  ],
  imports: [
    CommonModule,
    AperturaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe,
    SharedAppService
  ]
})
export class AperturaModule { }
