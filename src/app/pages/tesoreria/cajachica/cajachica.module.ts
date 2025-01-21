import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CCajachicaComponent } from './c-cajachica/c-cajachica.component';
import { CajachicaRoutingModule } from './cajachica-routing.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { TesoreriaService } from '../service/tesoreriaServices';
import { CCajaChicaDetalleComponent } from './c-cajachica-detalle/c-cajachica-detalle.component';



@NgModule({
  declarations: [
    CCajachicaComponent,
    CCajaChicaDetalleComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CajachicaRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, TesoreriaService]
})
export class CajachicaModule { }