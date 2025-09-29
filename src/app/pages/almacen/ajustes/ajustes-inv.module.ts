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
import { AlmacenService } from '../../almacen/service/almacenServices';
import { CAjustescabComponent } from './c-ajustescab-inv/c-ajustescab.component';
import { CAjustesdetComponent } from './c-ajustesdet-inv/c-ajustesdet.component';
import { AjustesInvRoutingModule } from './ajustes-inv-routing.module';


@NgModule({
  declarations: [
    CAjustescabComponent,
    CAjustesdetComponent
  ],
  imports: [
    CommonModule,
    AjustesInvRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class AjustesInvModule { }
