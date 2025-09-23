import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { AlmacenService } from '../service/almacenServices';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { CReubicacionComponent } from './c-reubicacion/c-reubicacion.component';
import { CReubicacionDetComponent } from './c-reubicacion-det/c-reubicaciondet.component';
import { ReubicacionRoutingModule } from './reubicacion-routing.module';


@NgModule({
  declarations: [
    CReubicacionComponent,
    CReubicacionDetComponent,
  ],
  imports: [
    CommonModule,
    ReubicacionRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, ContabilidadService]
})
export class ReubicacionModule { }