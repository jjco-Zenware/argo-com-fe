import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroFacturacionRoutingModule } from './registro-facturacion-routing.module';
import { CRegistroFacturacionComponent } from './c-registro-facturacion/c-registro-facturacion.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../../compras/Service/compraServices';
import { DatoFacturacionComponent } from './c-dato-facturacion/c-dato-facturacion.component';


@NgModule({
  declarations: [
    CRegistroFacturacionComponent,
    DatoFacturacionComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroFacturacionRoutingModule
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, ProyectosService, OrdencompraService, ComprasService]
})
export class RegistroFacturacionModule { }
