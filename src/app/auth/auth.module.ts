import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MsalModule } from '@azure/msal-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { CLoginComponent } from './c-login/c-login.component';
import { AuthService } from './auth.service';
import { CAuthComponent } from './c-auth/c-auth.component';
import { CAuthClaveComponent } from './c-auth-clave/c-auth-clave.component';
import { CAuthUsuarioComponent } from './c-auth-usuario/c-auth-usuario.component';
import { SharedAppModule } from '../shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';


@NgModule({
  declarations: [
    CLoginComponent,
    CAuthUsuarioComponent,
    CAuthClaveComponent,
    CAuthComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeNgModule,
    SharedAppModule,
    MsalModule
  ],
  providers:[
    AuthService
  ]
})
export class AuthModule { }
