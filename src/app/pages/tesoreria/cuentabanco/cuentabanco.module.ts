import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { CuentaBancoRoutingModule } from './cuentabanco-routing.module';
import { CCuentaBancoComponent } from './c-cuentabanco/c-cuentabanco.component';
import { CCuentaBancoDetComponent } from './c-cuentabanco-det/c-cuentabanco-det.component';



@NgModule({
  declarations: [
    CCuentaBancoComponent,
    CCuentaBancoDetComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CuentaBancoRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class CuentaBancoModule { }