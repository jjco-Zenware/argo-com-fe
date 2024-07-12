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
import { CCotizacionComponent } from './c-cotizacion-cab/c-cotizacion-cab.component';
import { CotizacionRoutingModule } from './cotizacion.routing.module';
import { CotizacionDetComponent } from './c-cotizacion-det/c-cotizacion-det.component';




@NgModule({
  declarations: [
    CCotizacionComponent,
    CotizacionDetComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
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
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, OrdencompraService]
})
export class CotizacionModule { }