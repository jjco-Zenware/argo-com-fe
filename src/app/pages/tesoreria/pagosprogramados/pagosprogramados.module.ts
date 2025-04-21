import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { TesoreriaService } from '../service/tesoreriaServices';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TagModule } from 'primeng/tag';
import { CPagosProComponent } from './c-pagospro/c-pagospro.component';
import { PagosProgramadosRoutingModule } from './pagosprogramados-routing';



@NgModule({
  declarations: [
    CPagosProComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    PagosProgramadosRoutingModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class PagosProgramadosModule { }