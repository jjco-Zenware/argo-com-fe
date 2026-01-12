import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AperturaCierreRoutingModule } from './apertura-cierre-routing.module';
import { CAperturaCierreListadoComponent } from './c-apertura-cierre-listado/c-apertura-cierre-listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { SharedAppModule } from 'src/app/shared/shared-App.module';


@NgModule({
  declarations: [
    CAperturaCierreListadoComponent
  ],
  imports: [
    CommonModule,
    AperturaCierreRoutingModule,
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
export class AperturaCierreModule { }
