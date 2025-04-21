import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNotaDebitoComponent } from './c-notadebito-lista/c-notadebito-lista.component';

const routes: Routes = [
  {
    path:'',
    component: CNotaDebitoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotaDebitoRoutingModule { }
