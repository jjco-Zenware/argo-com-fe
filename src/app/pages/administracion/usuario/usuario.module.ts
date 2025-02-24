import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AdministracionService } from '../service/administracionServices';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { CUsuarioComponent } from './c-usuario/c-usuario.component';
import { CUsuarioDetalleComponent } from './c-usuario-detalle/c-usuario-detalle.component';
import { TagModule } from 'primeng/tag';
import { CModalVinculadoComponent } from './modal-vinculado/c-modalvinculado.component';
import { CModalLaboralComponent } from './modal-laboral/c-modallaboral.component';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';

@NgModule({
  declarations: [
    CUsuarioComponent,
    CUsuarioDetalleComponent,
    CModalVinculadoComponent,
    CModalLaboralComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    TagModule,
    RegistroProveedorModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AdministracionService ]
})
export class UsuarioModule { }