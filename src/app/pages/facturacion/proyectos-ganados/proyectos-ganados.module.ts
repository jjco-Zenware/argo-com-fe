import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosGanadosRoutingModule } from './proyectos-ganados-routing.module';
import { CProyectosGanadosComponent } from './c-proyectos-ganados/c-proyectos-ganados.component';
import { CRegistroFacturacionComponent } from '../registro-facturacion/c-registro-facturacion/c-registro-facturacion.component';


@NgModule({
  declarations: [
    CProyectosGanadosComponent,
    CRegistroFacturacionComponent
  ],
  imports: [
    CommonModule,
    ProyectosGanadosRoutingModule
  ]
})
export class ProyectosGanadosModule { }
