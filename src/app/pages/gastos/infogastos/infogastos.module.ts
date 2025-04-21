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


@NgModule({
  declarations: [
    CInformeGastosComponent,
    CInformeGastosDetComponent
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
    SelectButtonModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, MarketingService, MessageService]
})
export class InformeGastosModule { }