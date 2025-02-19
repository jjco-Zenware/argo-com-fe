import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CUsuarioComponent } from './c-usuario/c-usuario.component';

const routes: Routes = [
    {
      path:'',
      component: CUsuarioComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }