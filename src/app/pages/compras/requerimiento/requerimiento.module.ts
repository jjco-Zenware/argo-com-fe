import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
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
import { CRequerimientoComponent } from './c-requerimiento-cab/c-requerimiento-cab.component';
import { RequerimientoDetComponent } from './c-requerimiento-det/c-requerimiento.det.component';
import { RequerimientoRoutingModule } from './requerimiento.routing.module';
import { CModalPropuestaComponent } from './modal-propuesta/c-modalpropuesta.component';
import { CItemCotizacionComponent } from './c-item-cotizacion/c-item-cotizacion.component';
import { CModalComentarioComponent } from './modal-comentario/c-modalcomentario.component';
import { CModalProveedorComponent } from './modal-proveedor/c-modalproveedor.component';

@NgModule({
  declarations: [
    CRequerimientoComponent,
    RequerimientoDetComponent,
    CModalPropuestaComponent,
    CItemCotizacionComponent,
    CModalComentarioComponent,
    CModalProveedorComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    RequerimientoRoutingModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ProyectosGanadosModule,
    SplitButtonModule,
    RegistroProveedorModule,
    SelectButtonModule,
    TagModule ,
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, OrdencompraService]
})
export class RequerimientoModule { }