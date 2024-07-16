import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroCompraRoutingModule } from './registro-compra-routing.module';
import { CRegistroCompraComponent } from './c-registro-compra/c-registro-compra.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatoCompraComponent } from './c-dato-compra/c-dato-compra.component';
import { ProyectosService } from '../proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';


@NgModule({
  declarations: [
    CRegistroCompraComponent,
    DatoCompraComponent
  ],
  imports: [
    CommonModule,
    RegistroCompraRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, ProyectosService, OrdencompraService]
})
export class RegistroCompraModule { }
