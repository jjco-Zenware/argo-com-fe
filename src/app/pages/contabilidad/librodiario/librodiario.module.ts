import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CLibroDiarioComponent } from './c-librodiario/c-librodiario.component';
import { LibroDiarioRoutingModule } from './librodiario-routing.module';

@NgModule({
  declarations: [
    CLibroDiarioComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    LibroDiarioRoutingModule
  ], 
  exports:[    
    CLibroDiarioComponent,
    ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class LibroDiarioModule { }