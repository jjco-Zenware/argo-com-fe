import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoProductoRoutingModule } from './catalogo-producto-routing.module';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../service/almacenServices';
import { MessageService } from 'primeng/api';
import { CCatalogoProductoDetalleComponent } from './c-catalogo-producto-detalle/c-catalogo-producto-detalle.component';
import { CCatalogoProductoComponent } from './c-catalogo-producto/c-catalogo-producto.component';
import { CmProductoComponenteComponent } from './cm-producto-componente/cm-producto-componente.component';
import { CatalogoProductoService } from './catalogo-producto.service';


@NgModule({
  declarations: [
    CCatalogoProductoComponent,
    CCatalogoProductoDetalleComponent,
    CmProductoComponenteComponent
  ],
  imports: [
    CommonModule,
    CatalogoProductoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CatalogoProductoService, SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, MessageService]
})
export class CatalogoProductoModule { }
