import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CGuiaRemisionListaComponent } from './c-guia-lista/c-guialista.component';
import { GuiaRemisionRoutingModule } from './guia-remision-routing.module';
import { CGuiaRemisionComponent } from './c-guia-det/c-guiadet.component';
import { RegistroProveedorModule } from '../../compras/registro-proveedor/registro-proveedor.module';
import { AlmacenService } from '../service/almacenServices';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CModalItemComponent } from './modal-item/modalitem.component';


@NgModule({
  declarations: [
    CGuiaRemisionListaComponent,
    CGuiaRemisionComponent  ,
    CModalItemComponent
  ],
  imports: [
    CommonModule,
    GuiaRemisionRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroProveedorModule,
    TagModule,
    SplitButtonModule,
    SelectButtonModule 
  ],
  providers: [SharedAppService, DynamicDialogRef, DynamicDialogConfig, AlmacenService, ContabilidadService]
})
export class GuiaRemisionModule { }