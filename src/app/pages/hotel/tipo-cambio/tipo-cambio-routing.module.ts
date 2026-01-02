import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CTipoCambioComponent } from './c-tipo-cambio/c-tipo-cambio.component';

const routes: Routes = [
  {
    path: '',
    component: CTipoCambioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCambioRoutingModule { }
