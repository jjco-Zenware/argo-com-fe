import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedAppModule } from '../../../shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { HistorialcargaRoutingModule } from './historialcarga-routing.module';
import { CHistocargaComponent } from './c-historialcarga/c-histocarga.component';
import { CargaSireService } from '../carga-masiva/service/cargasire.service';

@NgModule({
  declarations: [
    CHistocargaComponent,
  ],
  imports: [
    CommonModule,
    HistorialcargaRoutingModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    TagModule,
  ],
  providers: [MessageService, CargaSireService]
})
export class HistorialcargaModule { }
