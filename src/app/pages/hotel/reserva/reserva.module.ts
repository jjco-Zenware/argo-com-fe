import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { AlmacenModule } from '../../almacen/almacen.module';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CReservaListComponent } from './c-reserva-list/c-reserva-list.component';
import { ReservaRoutingModule } from './reserva-routing.module';
import { CReservaDetComponent } from './c-reserva-det/c-reserva-det.component';
import { RegistroVentaModule } from '../../facturacion/registro-venta/registro-venta.module';
import { CFacturacionHabitacionComponent } from './c-facturacion-habitacion/c-facturacion-habitacioncomponent';
import { ReservaService } from './reserva.service';
import { CmPersonaPaxComponent } from './cm-persona-pax/cm-persona-pax.component';
import { CmExcTransacReservaComponent } from './cm-exc-transac-reserva/cm-exc-transac-reserva.component';
import { CMAgregarProductoComponent } from './cm-agregar-producto/cm-agregar-producto.component';
import { CmRegistrarPagoComponent } from './cm-registrar-pago/cm-registrar-pago.component';
import { CmRegistrarFacturacionComponent } from './cm-registrar-facturacion/cm-registrar-facturacion.component';

@NgModule({
  declarations: [
    CReservaListComponent,
    CReservaDetComponent,
    CFacturacionHabitacionComponent,
    CmPersonaPaxComponent,
    CmExcTransacReservaComponent,
    CMAgregarProductoComponent,
    CmRegistrarPagoComponent,
    CmRegistrarFacturacionComponent
  ],
  imports: [
    CommonModule,
    ReservaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule ,
    AlmacenModule,
    InputNumberModule ,
    TagModule,
    RegistroProveedorModule,
    DropdownModule,
    //FacturacionModule
    RegistroVentaModule
  ],
  providers: [
    SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig, 
    ProyectosService, 
    OrdencompraService, 
    AlmacenService, 
    ContabilidadService,
    ConfirmationService,
    ReservaService
  ],
  exports: [
    CReservaDetComponent,
    CFacturacionHabitacionComponent
  ]
})
export class ReservaModule { }