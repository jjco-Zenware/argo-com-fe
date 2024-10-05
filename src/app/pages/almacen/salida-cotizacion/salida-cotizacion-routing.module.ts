import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaCotizacionComponent } from './c-listamovsal/c-listamovsal.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaCotizacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaCotizacionRoutingModule { }