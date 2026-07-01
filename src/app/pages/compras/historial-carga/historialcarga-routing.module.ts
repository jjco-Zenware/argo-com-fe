import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CHistocargaComponent } from './c-historialcarga/c-histocarga.component';

const routes: Routes = [
  {
    path: '',
    component: CHistocargaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialcargaRoutingModule { }
