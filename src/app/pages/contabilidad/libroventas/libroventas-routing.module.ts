import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLibroVentasComponent } from './c-libroventas/c-libroventas.component';

const routes: Routes = [
    {
      path:'',
      component: CLibroVentasComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibroVentasRoutingModule { }