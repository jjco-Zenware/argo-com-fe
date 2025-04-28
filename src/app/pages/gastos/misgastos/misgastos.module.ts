import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageService } from 'primeng/api';
import { MarketingService } from '../../marketing/service/marketingServices';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from '../../compras/Service/compraServices';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { MisGastosRoutingModule } from './misgastos-routing.module';
import { DatoMisGastosComponent } from './c-dato-misgastos/c-dato-misgastos.component';
import { CRegistroMisGastosComponent } from './c-registro-misgastos/c-registro-misgastos.component';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';


@NgModule({
  declarations: [
    CRegistroMisGastosComponent,
    DatoMisGastosComponent
  ],
  imports: [
    CommonModule,
    MisGastosRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule,
    SelectButtonModule ,
    TagModule
  ],
  providers: [
    SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig,
    MarketingService, 
    MessageService,
    UtilitariosService, 
    ComprasService ,
    OrdencompraService,
    ProyectosService
    ]
})
export class MisGastosModule { }