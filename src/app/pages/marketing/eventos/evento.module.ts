import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { EventoRoutingModule } from './evento-routing.module';
import { TagModule } from 'primeng/tag';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { MarketingService } from '../service/marketingServices';
import { CEventoComponent } from './c-evento/c-evento.component';
import { CEventoDetalleComponent } from './c-evento-detalle/c-evento-detalle.component';
import { ComprasService } from '../../compras/Service/compraServices';
import { CEventoListComponent } from './c-evento-list/c-evento-list.component';
import { CEventoCardComponent } from './c-evento-card/c-evento-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CheckboxModule } from 'primeng/checkbox';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { CModalProveedorComponent } from './modal-proveedor/c-modalproveedor.component';
import { CModalGastosComponent } from './modal-gastos/c-modalgastos.component';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { CModalPersonaComponent } from './modalPersona/c-modalpersona.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    CEventoComponent,
    CEventoDetalleComponent,
    CEventoListComponent,
    CEventoCardComponent,
    CModalProveedorComponent,
    CModalGastosComponent,
    CModalPersonaComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    EventoRoutingModule,
    TagModule,
    RegistroProveedorModule,
    DragDropModule,
    CheckboxModule,
    AutoCompleteModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, MarketingService,
     ComprasService, ProyectosService, OrdencompraService, ComprasService, DatePipe ]
})
export class EventoModule { }