import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CCatalogoComponent } from './c-catalogo/c-catalogo.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { AlmacenService } from '../service/almacenServices';

@NgModule({
  declarations: [
    CCatalogoComponent
  ],
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class CatalogoModule { }