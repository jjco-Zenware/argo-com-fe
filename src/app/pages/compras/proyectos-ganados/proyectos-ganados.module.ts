import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';


import { ProyectosGanadosRoutingModule } from './proyectos-ganados-routing.module';
import { CProyectosGanadosComponent } from './c-proyectos-ganados/c-proyectos-ganados.component';
import { CBusinessCaseComponent } from './c-business-case/c-business-case.component';
import { CCotizacionComponent } from './c-cotizacion/c-cotizacion.component';
import { ProyectosService } from './service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalProyectoComponent } from './modal-proyecto/modal-proyecto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CListaOrdenCompraServicioComponent } from './c-lista-oc/c-listaOC.component';
import { CDatoCotizacionComponent } from './c-dato-cotizacion/c-dato-cotizacion.component';
import { RegistroProveedorModule } from '../registro-proveedor/registro-proveedor.module';
import { CItemCotizacionComponent } from './c-item-cotizacion/c-item-cotizacion.component';
import { CDatoCotizacionViewComponent } from './c-dato-cotizacion-view/c-dato-cotizacion-view.component';
import { CDatoCotizacionViewProyecComponent } from './c-dato-cotizacion-view-proyec/c-dato-cotizacion-view-proyec.component';
import { TableModule } from 'primeng/table';
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CModalProductoComponent } from './modal-producto/c-modal-producto.component';



@NgModule({
  declarations: [
    CProyectosGanadosComponent,
    CBusinessCaseComponent,
    CCotizacionComponent,
    ModalProyectoComponent,
    CListaOrdenCompraServicioComponent,
    CDatoCotizacionComponent,
    CItemCotizacionComponent,
    CDatoCotizacionViewComponent,
    CDatoCotizacionViewProyecComponent,
    CModalProductoComponent
  ],
  imports: [
    CommonModule,
    SharedPrimeNgModule,
    SharedAppModule,
    ProyectosGanadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    RegistroProveedorModule,
    TableModule
  ],
  exports:[
    CCotizacionComponent
  ],
  providers: [SharedAppService, ProyectosService, DynamicDialogRef, DynamicDialogConfig, DatePipe, AlmacenService]
})
export class ProyectosGanadosModule { }
