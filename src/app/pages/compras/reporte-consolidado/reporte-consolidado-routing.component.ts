import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CReporteConsolidadoComponent } from './c-reporte-consolidado/c-reporte-consolidado.component';

const routes: Routes = [
  {
    path:'',
    component: CReporteConsolidadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteConsolidadoRoutingModule { }