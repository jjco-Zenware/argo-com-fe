import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CFlujoCajaComponent } from './c-flujocaja/c-flujocaja.component';
import { FlujoCajaRoutingModule } from './flujocaja-routing.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    CFlujoCajaComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FlujoCajaRoutingModule,
    TableModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class FlujocajaModule { }