import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { ImportacionRoutingModule } from './importacion-routing.module';
import { CImportacionComponent } from './c-importacion/c-importacion.component';



@NgModule({
  declarations: [
    CImportacionComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ImportacionRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class ImportacionModule { }