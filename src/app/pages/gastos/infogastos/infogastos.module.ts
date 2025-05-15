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
import { CInformeGastosComponent } from './c-infogastos-lista/c-infogastos.component';
import { InformeGastosRoutingModule } from './infogastos-routing.module';
import { CInformeGastosDetComponent } from './c-infogastos-detalle/c-infogastos-detalle.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from '../../compras/Service/compraServices';
import { CModalTransacComponent } from '../modal-trans-gasto/modal-transac.component';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';


@NgModule({
  declarations: [
    CInformeGastosComponent,
    CInformeGastosDetComponent,
    CModalTransacComponent
  ],
  imports: [
    CommonModule,
    InformeGastosRoutingModule,
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
  providers: [SharedAppService, 
    DynamicDialogRef, 
    DynamicDialogConfig,
     MarketingService,
      MessageService, 
      UtilitariosService, 
      ComprasService ,
      OrdencompraService,
      ]
})
export class InformeGastosModule { }