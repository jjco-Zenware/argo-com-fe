import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCatalogoComponent } from './c-catalogo/c-catalogo.component';

const routes: Routes = [
  {
    path:'',
    component: CCatalogoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule { }