import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AlmacenService } from '../service/almacenServices';
import { MovProductoRoutingModule } from './movProducto-routing.module';
import { CMovProductoComponent } from './c-movProducto/c-movProducto.component';

@NgModule({
  declarations: [
    CMovProductoComponent
  ],
  imports: [
    CommonModule,
    MovProductoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class MovProductoModule { }
