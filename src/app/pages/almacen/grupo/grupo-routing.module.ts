import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CGrupoComponent } from './c-grupo/c-grupo.component';

const routes: Routes = [
  {
    path:'',
    component: CGrupoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRoutingModule { }