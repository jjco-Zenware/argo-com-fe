import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../proyectos-ganados/proyectos-ganados.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';
import { MessageService } from 'primeng/api';
import { SharedAppModule } from '../../../shared/shared-App.module';
import { CargamasivaRoutingModule } from './cargamasiva-routing.module';
import { CCargamasivaComponent } from './c-cargamasiva/c-cargamasiva.component';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { CargaSireService } from './service/cargasire.service';




@NgModule({
  declarations: [
    CCargamasivaComponent,
  ],
  imports: [
    CommonModule,
    CargamasivaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule,
    SplitButtonModule,
    RegistroProveedorModule,
    SelectButtonModule,
    TagModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, OrdencompraService, MessageService, ContabilidadService, CargaSireService]
})
export class CargamasivaModule { }