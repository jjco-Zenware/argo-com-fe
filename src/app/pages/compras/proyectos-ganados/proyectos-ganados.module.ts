import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppModule } from 'src/app/shared/shared-App.module';


import { ProyectosGanadosRoutingModule } from './proyectos-ganados-routing.module';
import { CProyectosGanadosComponent } from './c-proyectos-ganados/c-proyectos-ganados.component';
import { CBusinessCaseComponent } from './c-business-case/c-business-case.component';
import { CCotizacionComponent } from './c-cotizacion/c-cotizacion.component';
import { ProyectosService } from './service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CProyectosGanadosComponent,
    CBusinessCaseComponent,
    CCotizacionComponent
  ],
  imports: [
    CommonModule,
    SharedPrimeNgModule,
    SharedAppModule,
    ProyectosGanadosRoutingModule
  ],
  exports:[
    CCotizacionComponent
  ],
  providers: [SharedAppService, ProyectosService, DynamicDialogRef, DynamicDialogConfig]
})
export class ProyectosGanadosModule { }
