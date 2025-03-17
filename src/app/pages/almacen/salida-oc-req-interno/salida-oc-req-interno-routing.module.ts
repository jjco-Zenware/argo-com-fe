import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaOcReqComponent } from './c-listamovsal/c-listamovsal.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaOcReqComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaOcReqRoutingModule { }