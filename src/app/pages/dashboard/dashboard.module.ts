import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CDashboardComponent } from './c-dashboard/c-dashboard.component';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { ProyectosService } from '../compras/proyectos-ganados/service/proyectos.service';
import { TesoreriaService } from '../tesoreria/service/tesoreriaServices';


@NgModule({
  declarations: [
    CDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    SharedPrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    ChartModule,
    TagModule
  ],
  providers: [
    ProyectosService,
    TesoreriaService
  ]
})
export class DashboardModule { }
