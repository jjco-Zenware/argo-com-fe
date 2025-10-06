import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CDetraccionComponent } from './c-detraccion/c-detraccion.component';

const routes: Routes = [
    {
      path:'',
      component: CDetraccionComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetraccionRoutingModule { }