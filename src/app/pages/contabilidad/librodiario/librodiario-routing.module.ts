import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLibroDiarioComponent } from './c-librodiario/c-librodiario.component';

const routes: Routes = [
    {
      path:'',
      component: CLibroDiarioComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibroDiarioRoutingModule { }