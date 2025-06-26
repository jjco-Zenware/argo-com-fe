import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AdministracionService } from '../service/administracionServices';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { ResultadoRoutingModule } from './resultado-routing.modul';
import { CResultadoComponent } from './c-resultado/c-resultado.component';

@NgModule({
  declarations: [
    CResultadoComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ResultadoRoutingModule,
    TagModule,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AdministracionService ]
})
export class ResultadoModule { }