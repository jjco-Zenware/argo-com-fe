import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CierreRoutingModule } from './cierre-routing.module';
import { CCierreListadoComponent } from './c-cierre-listado/c-cierre-listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { SharedAppModule } from 'src/app/shared/shared-App.module';


@NgModule({
  declarations: [
    CCierreListadoComponent
  ],
  imports: [
    CommonModule,
    CierreRoutingModule,
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
export class CierreModule { }
