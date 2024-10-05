import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCompraServicioRoutingModule } from './orden-compra-servicio-routing.module';
import { COrdenCompraServicioComponent } from './c-orden-compra-servicio/c-orden-compra-servicio.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CabeceraocComponent } from './cabeceraoc/cabeceraoc.component';
import { DetalleocComponent } from './detalleoc/detalleoc.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectosGanadosModule } from '../proyectos-ganados/proyectos-ganados.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { CContactoComponent } from './c-contacto/c-contacto.component';
import { OrdencompraService } from './service/ordencompra.service';
import { CModalExcTransacComponent } from './modal-exc-transac/modal-exc-transac.component';
import { CDatoCotizacionComponent } from './c-dato-cotizacion/c-dato-cotizacion.component';
import { CCotizacionComponent } from './c-cotizacion/c-cotizacion.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CModalExcAlmacenComponent } from './modal-exc-almacen/modal-exc-almacen.component';




@NgModule({
  declarations: [
    COrdenCompraServicioComponent,
    CabeceraocComponent,
    DetalleocComponent,
    CContactoComponent,
    CModalExcTransacComponent,
    CCotizacionComponent,
    CDatoCotizacionComponent,
    CModalExcAlmacenComponent
  ],
  imports: [
    CommonModule,
    OrdenCompraServicioRoutingModule,
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
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, OrdencompraService, AlmacenService]
})
export class OrdenCompraServicioModule { }
