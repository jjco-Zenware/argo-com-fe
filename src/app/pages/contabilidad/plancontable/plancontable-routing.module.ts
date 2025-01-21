import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPlanContableComponent } from './c-plancontable/c-plancontable.component';

const routes: Routes = [
    {
      path:'',
      component: CPlanContableComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanContableRoutingModule { }