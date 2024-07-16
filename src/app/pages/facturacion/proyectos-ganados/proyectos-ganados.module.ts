import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosGanadosRoutingModule } from './proyectos-ganados-routing.module';
import { CProyectosGanadosComponent } from './c-proyectos-ganados/c-proyectos-ganados.component';


@NgModule({
  declarations: [
    CProyectosGanadosComponent
  ],
  imports: [
    CommonModule,
    ProyectosGanadosRoutingModule
  ]
})
export class ProyectosGanadosModule { }
