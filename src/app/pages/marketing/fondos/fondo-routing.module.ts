import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CFondoComponent } from './c-fondo/c-fondo.component';

const routes: Routes = [
    {
      path:'',
      component: CFondoComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FondoRoutingModule { }