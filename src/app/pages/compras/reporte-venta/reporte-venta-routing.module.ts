import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CReporteVentaComponent } from './c-reporte-venta/c-reporte-venta.component';

const routes: Routes = [
  {
    path:'',
    component: CReporteVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentaRoutingModule { }
