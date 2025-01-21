import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CReporteCompraComponent } from './c-reporte-compra/c-reporte-compra.component';

const routes: Routes = [
  {
    path:'',
    component: CReporteCompraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteCompraRoutingModule { }
