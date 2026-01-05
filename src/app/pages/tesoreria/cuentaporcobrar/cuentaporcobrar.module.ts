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
import { CModalListPAgosComponent } from '../modallistpagos/c-modallistpagos.component';
import { CModalRegPAgosComponent } from '../modalregpagos/c-modalregpagos.component';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { CModalListAsiento } from '../modalasientos/c-modalasiento.component';



@NgModule({
  declarations: [
    CCuentaporCobrarComponent,
    CModalListPAgosComponent,
    CModalRegPAgosComponent,
    CModalListAsiento
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
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService, ContabilidadService]
})
export class CuentaporCobrarModule { }