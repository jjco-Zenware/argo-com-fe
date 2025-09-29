import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../almacen/service/almacenServices';import { AmarreContableRoutingModule } from './amarrecontable-routing.module';
import { CAmarreContableComponent } from './c-amarrecontable/c-amarrecontable.component';
import { CAmarreContableDetComponent } from './c-amarrecontabledet/c-amarrecontabledet.component';
import { ModalAmarreComponent } from './modal-plan/modal-amarre.component';

@NgModule({
  declarations: [
    CAmarreContableComponent,    
    ModalAmarreComponent,
    CAmarreContableDetComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    AmarreContableRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class AmarreContableModule { }