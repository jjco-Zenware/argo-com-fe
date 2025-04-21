import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroClienteRoutingModule } from './registro-cliente-routing.module';
import { CRegistroClienteComponent } from './c-registro-cliente/c-registro-cliente.component';
import { CDatoClienteComponent } from './c-dato-cliente/c-dato-cliente.component';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';


@NgModule({
  declarations: [
    CRegistroClienteComponent,
    CDatoClienteComponent,
  ],
  imports: [
    CommonModule,
    RegistroClienteRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule
  ],
  
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class RegistroClienteModule { }