import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLibroComprasComponent } from './c-librocompras/c-librocompras.component';

const routes: Routes = [
    {
      path:'',
      component: CLibroComprasComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibroComprasRoutingModule { }