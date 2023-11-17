import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAuthComponent } from './c-auth/c-auth.component';
//import { CLoginComponent } from './c-login/c-login.component';

const routes: Routes = [
  {
    path: '',
    component: CAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
