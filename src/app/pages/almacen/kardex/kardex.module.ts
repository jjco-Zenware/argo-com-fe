import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KardexRoutingModule } from './kardex-routing.module';
import { CKardexComponent } from './c-kardex/c-kardex.component';


@NgModule({
  declarations: [
    CKardexComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule
  ]
})
export class KardexModule { }
