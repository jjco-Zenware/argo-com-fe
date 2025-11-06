import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ComprasService } from '../compras/Service/compraServices';
import { CMotivoComponent } from './modalanular/c-modalanular.component';


@NgModule({
  declarations: [   
    CMotivoComponent     
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FacturacionRoutingModule
  ],
  exports: [
    CMotivoComponent
  ],
  providers: [ComprasService]
})
export class FacturacionModule { }
