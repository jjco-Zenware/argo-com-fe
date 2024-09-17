import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { CCajachicaComponent } from './c-cajachica/c-cajachica.component';
import { CajachicaRoutingModule } from './cajachica-routing.module';



@NgModule({
  declarations: [
    CCajachicaComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    CajachicaRoutingModule
  ]
})
export class CajachicaModule { }