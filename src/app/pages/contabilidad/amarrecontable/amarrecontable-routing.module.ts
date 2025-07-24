import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAmarreContableComponent } from './c-amarrecontable/c-amarrecontable.component';

const routes: Routes = [
    {
      path:'',
      component: CAmarreContableComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmarreContableRoutingModule { }