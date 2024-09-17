import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CFlujoCajaComponent } from './c-flujocaja/c-flujocaja.component';
import { FlujoCajaRoutingModule } from './flujocaja-routing.module';



@NgModule({
  declarations: [
    CFlujoCajaComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    FlujoCajaRoutingModule
  ]
})
export class FlujocajaModule { }