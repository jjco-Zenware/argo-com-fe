import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CBalanceComponent } from './c-balance/c-balance.component';
import { BalanceRoutingModule } from './balance-routing.module';
import { TesoreriaService } from '../../tesoreria/service/tesoreriaServices';
import { SharedAppModule } from '../../../shared/shared-App.module';

@NgModule({
  declarations: [
    CBalanceComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    BalanceRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, TesoreriaService]
})
export class BalanceModule { }