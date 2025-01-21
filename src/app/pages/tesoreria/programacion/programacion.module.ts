import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CProgramacionComponent } from './c-programacion/c-programacion.component';
import { ProgramacionRoutingModule } from './programacion-routing.module';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TesoreriaService } from '../service/tesoreriaServices';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { TagModule } from 'primeng/tag';
import { CModalProgramComponent } from './modal-progra/c-modal-program.component';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { CProgramacionDetalleComponent } from './c-programacion-det/c-programacion-det.component';
import { CModalProgramDetComponent } from './modal-progradet/c-modal-programdet.component';



@NgModule({
  declarations: [
    CProgramacionComponent,
    CProgramacionDetalleComponent,
    CModalProgramComponent,
    CModalProgramDetComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProgramacionRoutingModule,
    TagModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, TesoreriaService, ProyectosService, DatePipe, OrdencompraService]
})
export class ProgramacionModule { }