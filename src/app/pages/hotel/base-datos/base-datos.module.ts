import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseDatosRoutingModule } from './base-datos-routing.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { CRegistroClienteComponent } from './c-registro-cliente/c-registro-cliente.component';
import { CDatoClienteComponent } from './c-dato-cliente/c-dato-cliente.component';


@NgModule({
  declarations: [
    CRegistroClienteComponent,
    CDatoClienteComponent,
  ],
  imports: [
    CommonModule,
    BaseDatosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class BaseDatosModule { }
