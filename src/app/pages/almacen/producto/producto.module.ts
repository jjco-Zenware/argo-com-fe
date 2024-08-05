import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { CProductoComponent } from './c-producto/c-producto.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CProductoDetalleComponent } from './c-producto-detalle/c-producto-detalle.component';
import { AlmacenService } from '../service/almacenServices';


@NgModule({
  declarations: [
    CProductoComponent,
    CProductoDetalleComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService]
})
export class ProductoModule { }
