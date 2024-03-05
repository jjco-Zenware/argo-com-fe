import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIngresoOcReqInternoComponent } from './c-ingreso-oc-req-interno/c-ingreso-oc-req-interno.component';

const routes: Routes = [
  {
    path:'',
    component: CIngresoOcReqInternoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoOcReqInternoRoutingModule { }
