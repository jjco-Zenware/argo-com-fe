import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { EstadosFinancierosRoutingModule } from './eeff-routing.module';
import { CEstadosFinancierosComponent } from './c-eeff/c-eeff.component';

@NgModule({
  declarations: [
    CEstadosFinancierosComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    EstadosFinancierosRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class EstadosFinancierosModule { }