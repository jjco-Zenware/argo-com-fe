import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COficinaComponent } from './c-oficina/c-oficina.component';

const routes: Routes = [
  {
    path:'',
    component: COficinaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OficinaRoutingModule { }
