import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoHabitacionRoutingModule } from './catalogo-habitacion-routing.module';
import { CCatalogoHabitacionComponent } from './c-catalogo-habitacion/c-catalogo-habitacion.component';
import { CCatalogoHabitacionDetalleComponent } from './c-catalogo-habitacion-detalle/c-catalogo-habitacion-detalle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { AlmacenModule } from '../../almacen/almacen.module';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { CatalogoHabitacionService } from './catalogo-habitacion.service';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    CCatalogoHabitacionComponent,
    CCatalogoHabitacionDetalleComponent
  ],
  imports: [
    CommonModule,
    CatalogoHabitacionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeNgModule,
    FieldsetModule,
    AlmacenModule,
    InputNumberModule,
    TagModule,
    RegistroProveedorModule,
    DropdownModule
  ],
  providers: [CatalogoHabitacionService, SharedAppService, ConfirmationService]
})
export class CatalogoHabitacionModule { }
