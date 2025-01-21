import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLibroMayorComponent } from './c-libromayor/c-libromayor.component';

const routes: Routes = [
    {
      path:'',
      component: CLibroMayorComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibroMayorRoutingModule { }