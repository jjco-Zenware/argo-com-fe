import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenesRoutingModule } from './almacenes-routing.module';
import { CAlmacenesComponent } from './c-almacenes/c-almacenes.component';


@NgModule({
  declarations: [
    CAlmacenesComponent
  ],
  imports: [
    CommonModule,
    AlmacenesRoutingModule
  ]
})
export class AlmacenesModule { }
