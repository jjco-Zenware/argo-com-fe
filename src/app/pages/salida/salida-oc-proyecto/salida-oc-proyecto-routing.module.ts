import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaOcProyectoComponent } from './c-listamovsal/c-listamovsal.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaOcProyectoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaOcProyectoRoutingModule { }