import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRegistroProveedorComponent } from './c-registro-proveedor/c-registro-proveedor.component';
import { RegistroProveedorRoutingModule } from './registro-proveedor-routing.module';
import { CDatoProveedorComponent } from './c-dato-proveedor/c-dato-proveedor.component';
import { CContactoComponent } from './c-contacto/c-contacto.component';
import { CBancarioComponent } from './c-bancario/c-bancario.component';
import { CAdjuntosComponent } from './c-adjuntos/c-adjuntos.component';
import { CCondicionesComponent } from './c-condiciones/c-condiciones.component';


@NgModule({
  declarations: [
    CRegistroProveedorComponent,
    CDatoProveedorComponent,
    CContactoComponent,
    CBancarioComponent,
    CAdjuntosComponent,
    CCondicionesComponent
  ],
  imports: [
    CommonModule,
    RegistroProveedorRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[    
    CAdjuntosComponent,
    CContactoComponent,
    CBancarioComponent,
    CCondicionesComponent
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig]
})
export class RegistroProveedorModule { }