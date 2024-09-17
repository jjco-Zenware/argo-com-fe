import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CFlujoCajaComponent } from './c-flujocaja/c-flujocaja.component';

const routes: Routes = [
    {
      path:'',
      component: CFlujoCajaComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCajaRoutingModule { }