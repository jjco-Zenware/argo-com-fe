import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { MovimientosRoutingModule } from './movimientos-routing.module';
import { CMovimientosComponent } from './c-movimientos/c-movimientos.component';



@NgModule({
  declarations: [
    CMovimientosComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    MovimientosRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class MovimientosModule { }