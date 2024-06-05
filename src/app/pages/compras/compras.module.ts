import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { ComprasService } from './Service/compraServices';

//import { FieldsetModule } from 'primeng/fieldset';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    ComprasRoutingModule,
    //FieldsetModule
  ],
  providers: [ComprasService]
})
export class ComprasModule { }
