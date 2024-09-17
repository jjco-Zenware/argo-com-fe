import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CCuentaporCobrarComponent } from './c-cuentaporcobrar/c-cuentaporcobrar.component';
import { CuentaporCobrarRoutingModule } from './cuentaporcobrar-routing.module';
import { TesoreriaService } from '../service/tesoreriaServices';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TagModule } from 'primeng/tag';



@NgModule({
  declarations: [
    CCuentaporCobrarComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CuentaporCobrarRoutingModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService]
})
export class CuentaporCobrarModule { }