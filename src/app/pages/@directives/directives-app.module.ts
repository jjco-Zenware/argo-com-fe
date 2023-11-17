import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailValidatorDirective } from './email-validator.directive';
import { GenerarUserLoginDirective } from './generar-user-login.directive';



@NgModule({
  declarations: [
    EmailValidatorDirective,
    GenerarUserLoginDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    EmailValidatorDirective,
    GenerarUserLoginDirective
  ]
})
export class DirectivesAppModule { }
