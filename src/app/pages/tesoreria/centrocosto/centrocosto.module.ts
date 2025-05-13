import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TesoreriaService } from '../service/tesoreriaServices';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { CCentroCostoComponent } from './c-centro-lista/c-centrocosto.component';
import { CCentroCostoDetComponent } from './c-centro-det/c-centrocostodet.component';
import { CentroCostoRoutingModule } from './centrocosto-routing.module';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';



@NgModule({
  declarations: [
    CCentroCostoComponent,
    CCentroCostoDetComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CentroCostoRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService, ContabilidadService]
})
export class CentroCostoModule { }