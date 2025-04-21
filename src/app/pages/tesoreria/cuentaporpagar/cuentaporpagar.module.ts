import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CCuentaporPagarComponent } from './c-cuentaporpagar/c-cuentaporpagar.component';
import { CuentaporPagarRoutingModule } from './cuentaporpagar-routing.module';
import { TesoreriaService } from '../service/tesoreriaServices';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TagModule } from 'primeng/tag';
import { CModalProgramacionComponent } from '../modalfecprogramacion/c-modalfecprogramacion.component';



@NgModule({
  declarations: [
    CCuentaporPagarComponent,
    CModalProgramacionComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CuentaporPagarRoutingModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class CuentaporPagarModule { }